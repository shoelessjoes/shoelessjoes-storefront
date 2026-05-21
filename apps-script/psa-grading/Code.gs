/**
 * SHOELESS JOE'S — PSA Submission Apps Script v5
 * ================================================
 * Handles: Shopify order creation + Google Sheet logging + Customer email
 *
 * SETUP:
 * 1. SHEET_ID below = your Google Sheet ID (from the sheet URL).
 * 2. Project Settings → Script Properties → add property:
 *      SHOPIFY_TOKEN = shpat_xxxxxxxxxxxxxxxxxxxx   (your rotated Admin API token)
 *    The token lives ONLY here — never in the public form asset.
 * 3. Save → Deploy → New Deployment → Web App
 *      Execute as: Me  |  Who has access: Anyone
 * 4. Copy the /exec Web App URL → paste into the form CONFIG as APPS_SCRIPT_URL.
 */

var SHEET_ID      = '1iscPzIuOFCgRQckDH6qERrBsQD4VTpooEbVVy-KPMVw';
var STORE_EMAIL   = 'contact@shoelessjoescards.com';
var SECRET_KEY    = 'SJ-PSA-2024';
var SHOPIFY_STORE = 'shoelessjoescards.myshopify.com';
var SHOPIFY_TOKEN = PropertiesService.getScriptProperties().getProperty('SHOPIFY_TOKEN');

// ── Main entry point ──────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.secret !== SECRET_KEY) {
      return out({ status: 'error', message: 'Unauthorized' });
    }

    // Step 1: Build line_items from groupDetails and create Shopify order
    var shopifyOrderNumber = '';
    var shopifyOrderId     = '';
    try {
      var groups = data.groupDetails || [];
      if (SHOPIFY_STORE && SHOPIFY_TOKEN && groups.length > 0) {

        var lineItems = groups.map(function(g, i) {
          var perCard = (g.cards > 0 && g.est > 0) ? g.est / g.cards : 0;
          return {
            title: 'PSA Sub #' + (i + 1) + ' — ' + g.grader + ' / ' + g.tier,
            quantity: g.cards,
            price: perCard.toFixed(2),
            requires_shipping: false,
            taxable: false,
            properties: [
              { name: 'Submission ID',  value: g.subId },
              { name: 'Grader',         value: g.grader },
              { name: 'Service Level',  value: g.tier },
              { name: 'Master Sub ID',  value: data.masterSubId }
            ]
          };
        });

        // Per-card add-ons (priced server-side so the form can't be tampered with)
        if (data.prepCount > 0) {
          lineItems.push({ title: 'Prep / Entry — sleeve + wipe + order entry',
            quantity: data.prepCount, price: '2.00', requires_shipping: false, taxable: false });
        }
        if (data.revCount > 0) {
          lineItems.push({ title: 'Review — yes/no grading recommendation',
            quantity: data.revCount, price: '3.00', requires_shipping: false, taxable: false });
        }
        if (data.restore) {
          lineItems.push({ title: 'Full Review + Restore (priced at drop-off)',
            quantity: 1, price: '0.00', requires_shipping: false, taxable: false });
        }

        var cadence = (data.cadence === 'weekly') ? 'weekly' : 'monthly';
        var cadenceTag = 'psa-' + cadence;  // psa-weekly | psa-monthly

        var noteLines = [
          'Master Sub ID: ' + data.masterSubId,
          'SUBMISSION RUN: ' + cadence.toUpperCase(),
          'PAYMENT DUE UPFRONT AT DROP-OFF',
          'Drop-off: '       + (data.date     || ''),
          'Payment Method: ' + (data.payment  || ''),
          'Shipping: '       + (data.shipping || ''),
          'Total Cards: '    + (data.totalCards || ''),
          'Groups: '         + groups.length
        ];
        if (data.comments) { noteLines.push('Notes: ' + data.comments); }

        var builtPayload = {
          order: {
            line_items: lineItems,
            customer: {
              first_name: data.first,
              last_name:  data.last,
              email:      data.email,
              phone:      data.phone || undefined,
              tags:       'psa-submission'
            },
            financial_status: 'pending',
            tags: 'psa-submission,payment-upfront,' + cadenceTag + ',master-id:' + data.masterSubId,
            note: noteLines.join('\n'),
            note_attributes: [
              { name: 'Master Submission ID', value: data.masterSubId },
              { name: 'Submission Run',       value: cadence },
              { name: 'Drop-off Date',        value: data.date    || '' },
              { name: 'Payment Method',       value: data.payment || '' },
              { name: 'Total Cards',          value: String(data.totalCards || '') }
            ],
            send_receipt: true,
            send_fulfillment_receipt: true
          }
        };

        console.log('Creating Shopify order — line_items: ' + lineItems.length);
        var order      = createShopifyOrder(SHOPIFY_STORE, SHOPIFY_TOKEN, builtPayload);
        shopifyOrderNumber = String(order.order_number || '');
        shopifyOrderId     = String(order.id || '');
        console.log('Shopify order created: #' + shopifyOrderNumber);
      }
    } catch (shopifyErr) {
      console.error('Shopify error: ' + shopifyErr.message);
      shopifyOrderNumber = 'ERROR: ' + shopifyErr.message;
    }

    // Step 2: Log to Google Sheet
    data.shopifyOrderId = shopifyOrderNumber;
    var ss = SpreadsheetApp.openById(SHEET_ID);
    ensureSheets(ss);
    logOrder(ss, data);
    logGroups(ss, data);

    // Step 3: Send confirmation email
    sendEmail(data);

    return out({
      status: 'ok',
      masterSubId: data.masterSubId,
      shopifyOrderNumber: shopifyOrderNumber,
      shopifyOrderId: shopifyOrderId
    });

  } catch (err) {
    console.error('doPost error: ' + err.message);
    return out({ status: 'error', message: err.message });
  }
}

// ── Shopify order creation ────────────────────────────────────────────────────
function createShopifyOrder(store, token, orderPayload) {
  var url = 'https://' + store + '/admin/api/2024-01/orders.json';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'X-Shopify-Access-Token': token },
    payload: JSON.stringify(orderPayload),
    muteHttpExceptions: true
  });
  var code = res.getResponseCode();
  var body = JSON.parse(res.getContentText());
  if (code !== 201) {
    throw new Error('HTTP ' + code + ': ' + JSON.stringify(body.errors || body));
  }
  return body.order;
}

// ── Create sheet tabs if they don't exist ────────────────────────────────────
function ensureSheets(ss) {
  if (!ss.getSheetByName('Submissions')) {
    var s = ss.insertSheet('Submissions');
    var h = [
      'Submission ID', 'Master Order ID', 'Shopify Order #', 'Date', 'Run',
      'First', 'Last', 'Email', 'Phone', 'Grader', 'Service Level',
      'Cards', 'PSA Est ($)', 'Payment', 'Card List', 'Status', 'Notes'
    ];
    s.getRange(1, 1, 1, h.length).setValues([h])
     .setBackground('#173B4E').setFontColor('#F5EEDC').setFontWeight('bold');
    s.setFrozenRows(1);
    s.setColumnWidth(15, 400);
  }
  if (!ss.getSheetByName('Orders')) {
    var s2 = ss.insertSheet('Orders');
    var h2 = [
      'Master ID', 'Shopify Order #', 'Date', 'Run', 'First', 'Last', 'Email',
      'Phone', 'Total Cards', 'Groups', 'Grand Total', 'Payment',
      'Shipping', 'Comments', 'Submitted At'
    ];
    s2.getRange(1, 1, 1, h2.length).setValues([h2])
      .setBackground('#173B4E').setFontColor('#F5EEDC').setFontWeight('bold');
    s2.setFrozenRows(1);
  }
}

// ── Log master order row ──────────────────────────────────────────────────────
function logOrder(ss, data) {
  ss.getSheetByName('Orders').appendRow([
    data.masterSubId,
    data.shopifyOrderId || '',
    data.date,
    data.cadence || 'monthly',
    data.first,
    data.last,
    data.email,
    data.phone || '',
    data.totalCards,
    data.groups,
    data.grandTotal || '',
    data.payment,
    data.shipping || '',
    data.comments || '',
    new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  ]);
}

// ── Log one row per submission group ─────────────────────────────────────────
function logGroups(ss, data) {
  var sheet = ss.getSheetByName('Submissions');
  (data.groupDetails || []).forEach(function(g) {
    var csvLines = (data.csv || '').split('\n').slice(1);
    var matchLine = '';
    for (var i = 0; i < csvLines.length; i++) {
      if (csvLines[i].indexOf(g.subId) !== -1) { matchLine = csvLines[i]; break; }
    }
    var cols = matchLine.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    var cardList = (cols[cols.length - 1] || '').replace(/^"|"$/g, '').replace(/^~/, '');
    sheet.appendRow([
      g.subId,
      data.masterSubId,
      data.shopifyOrderId || '',
      data.date,
      data.cadence || 'monthly',
      data.first,
      data.last,
      data.email,
      data.phone || '',
      g.grader,
      g.tier,
      g.cards,
      g.est || 0,
      data.payment,
      cardList,
      'Submitted — Awaiting PSA',
      data.comments || ''
    ]);
  });
}

// ── Confirmation email ────────────────────────────────────────────────────────
function sendEmail(data) {
  if (!data.email) return;
  var groups = data.groupDetails || [];
  var groupLines = groups.map(function(g, i) {
    return '  Sub #' + (i + 1) + ': ' + g.grader + ' / ' + g.tier +
           ' — ' + g.cards + ' card' + (g.cards !== 1 ? 's' : '') +
           (g.est > 0 ? ' (est. $' + g.est + ')' : '');
  }).join('\n');

  var subject = 'PSA Submission Confirmed — ' + data.masterSubId + ' | Shoeless Joes Cards & Collectibles';
  var body =
    'Hi ' + data.first + ',\n\n' +
    'Thank you for your PSA submission at Shoeless Joes!\n\n' +
    'Master Order ID: ' + data.masterSubId + '\n' +
    (data.shopifyOrderId ? 'Shopify Order:   #' + data.shopifyOrderId + '\n' : '') +
    'Drop-Off Date:   ' + (data.date || '') + '\n' +
    'Total Cards:     ' + data.totalCards + '\n' +
    'Est. Total:      ' + (data.grandTotal || 'See receipt') + '\n' +
    'Payment:         ' + data.payment + '\n\n' +
    'SUBMISSION GROUPS\n' +
    '=================\n' +
    groupLines + '\n\n' +
    'Each group is submitted separately and returns on its own timeline.\n' +
    'We will contact you as each batch arrives back.\n\n' +
    'Track at: https://www.csgrading.com\n\n' +
    'Reminders:\n' +
    '- Grades released only after full payment\n' +
    '- Pick up within 6 months of return\n' +
    '- PSA upcharges (if any) collected at pickup\n\n' +
    "Shoeless Joe's Cards & Collectibles\n" +
    'PSA Authorized Agent | Est. 1992';

  try {
    GmailApp.sendEmail(data.email, subject, body, {
      replyTo: STORE_EMAIL,
      name: "Shoeless Joe's Cards & Collectibles"
    });
  } catch (e) {
    console.warn('Email failed: ' + e.message);
  }
}

// ── GET: download Submissions tab as CSV ──────────────────────────────────────
function doGet(e) {
  var ss    = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName('Submissions');
  if (!sheet) return ContentService.createTextOutput('No submissions yet.');
  var rows = sheet.getDataRange().getValues();
  var csv  = rows.map(function(row) {
    return row.map(function(cell) {
      var s = String(cell || '');
      return (s.indexOf(',') > -1 || s.indexOf('"') > -1 || s.indexOf('\n') > -1)
        ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',');
  }).join('\n');
  return ContentService.createTextOutput(csv)
    .setMimeType(ContentService.MimeType.CSV)
    .downloadAsFile('SlabTracker_ShoelessJoes.csv');
}

// ── Helper ────────────────────────────────────────────────────────────────────
function out(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Test: run this from Apps Script editor to verify Shopify connection ───────
function testShopifyDirect() {
  var STORE = SHOPIFY_STORE;
  var TOKEN = SHOPIFY_TOKEN;  // from Script Properties — no hardcoded secret
  if (!TOKEN) { Logger.log('SHOPIFY_TOKEN script property is not set.'); return; }

  var testOrder = {
    order: {
      line_items: [{
        title: 'TEST — PSA Sub #1 — PSA / Value',
        quantity: 1,
        price: '34.99',
        requires_shipping: false,
        taxable: false
      }],
      customer: {
        first_name: 'Test',
        last_name: 'Customer',
        email: 'test@test.com'
      },
      financial_status: 'pending',
      note: 'TEST ORDER — safe to delete',
      tags: 'test,psa-submission'
    }
  };

  var url = 'https://' + STORE + '/admin/api/2024-01/orders.json';
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { 'X-Shopify-Access-Token': TOKEN },
    payload: JSON.stringify(testOrder),
    muteHttpExceptions: true
  });

  var code = res.getResponseCode();
  var body = res.getContentText();
  Logger.log('Response code: ' + code);
  Logger.log('Response body: ' + body);

  if (code === 201) {
    var order = JSON.parse(body).order;
    Logger.log('SUCCESS — Order #' + order.order_number + ' created (safe to delete)');
  } else {
    Logger.log('FAILED — see body above');
  }
}
