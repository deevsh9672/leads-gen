const { validateWhatsAppMobile } = require('../services/whatsappValidator');

const cases = [
  { phone: '+91 88905 39867', country: 'in', city: 'Jaipur', expected: true },
  { phone: '01414599845', country: 'in', city: 'Jaipur', expected: false },
  { phone: '+91 141 4007244', country: 'in', city: 'Jaipur', expected: false },
  { phone: '+91 70145 34034', country: 'in', city: 'Jaipur', expected: true },
  { phone: '+1 (416) 506-0804', country: 'ca', city: 'Toronto', expected: true },
  { phone: '416-362-8677', country: 'ca', city: 'Toronto', expected: true },
  { phone: '12345', country: 'in', city: 'Jaipur', expected: false }
];

console.log('Testing WhatsApp Mobile Validator:');
let passed = 0;
cases.forEach((c, idx) => {
  const res = validateWhatsAppMobile(c.phone, c.country, c.city);
  const ok = res.isValid === c.expected;
  if (ok) passed++;
  console.log(`[#${idx+1}] ${ok ? '✅ PASS' : '❌ FAIL'}: ${c.phone} -> valid: ${res.isValid} (expected: ${c.expected}) | ${res.reason}`);
});

console.log(`\nResult: ${passed}/${cases.length} passed.`);
if (passed !== cases.length) process.exit(1);
