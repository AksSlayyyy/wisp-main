import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const reportFunctions = source.slice(source.indexOf('function visualReadinessReport('), source.indexOf('function compactRiskFinding('));
const flagsFunction = source.slice(source.indexOf('function getFlags()'), source.indexOf('function scoreAssessment()'));
function render(form = {}) {
  const context = vm.createContext({
    state: { form },
    assessmentQuestions: ['Data Security', 'Backup & Recovery', 'Data Security'].map(domain => ({ domain, question: domain, options: [{ label: 'Absent', score: 0 }, { label: 'Partial', score: 5 }, { label: 'Strong', score: 10 }] })),
    sections: ['Practice', 'Access controls', 'Restore checks', 'MFA'],
    escapeHtml: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;'),
  });
  return vm.runInContext(`${flagsFunction}\n${reportFunctions}\nvisualReadinessReport()`, context);
}
test('unanswered assessments show no score and no invented gap', () => {
  const html = render();
  assert.match(html, /Readiness not assessed/);
  assert.match(html, /<strong>0<\/strong><span>gaps identified/);
  assert.match(html, /3 unanswered questions are excluded/);
  assert.doesNotMatch(html, /NaN|Infinity/);
});
test('partial assessments exclude missing answers from the provisional average', () => {
  const html = render({ question_1: 'Strong' });
  assert.match(html, /Provisional readiness: 100 out of 100/);
  assert.match(html, /2 unanswered questions are excluded/);
});
test('urgent actions precede lower priority actions and answers are escaped', () => {
  const html = render({ companyName: '<img src=x>', question_1: 'Partial', question_2: 'Absent', question_3: 'Strong' });
  assert.match(html, /Readiness: 50 out of 100/);
  assert.match(html, /Recommended this week/);
  assert.ok(html.indexOf('data-edit-section="2"') < html.indexOf('data-edit-section="1"'));
  assert.match(html, /&lt;img src=x&gt;/);
  assert.doesNotMatch(html, /<img src=x>/);
});
test('strong results show no false urgency or placeholder finding', () => {
  const html = render({ question_1: 'Strong', question_2: 'Strong', question_3: 'Strong' });
  assert.match(html, /Readiness: 100 out of 100/);
  assert.match(html, /<strong>0<\/strong><span>gaps identified/);
  assert.match(html, /A strong starting point/);
  assert.doesNotMatch(html, /data-edit-section=/);
});
