const nstat = require('../index.js');

const sleep = nstat.stat.dataset('sleep');
const g1 = sleep.subset('group', (x) => x === '1').colToArray('extra');
const g2 = sleep.subset('group', (x) => x === '2').colToArray('extra');

console.log('Paired t-test:');
console.log(nstat.stat.tests.t_test(g1, g2, { paired: true }));

console.log('\nWilcoxon signed-rank on paired differences:');
const diff = g1.map((x, i) => x - g2[i]);
console.log(nstat.stat.tests.wilcox_test(diff, 0));

console.log('\nOne-way ANOVA:');
const model = nstat.stat.tests.aov('extra ~ group', sleep);
console.log(model);

console.log('\nTukey HSD:');
console.log(nstat.stat.tests.tukeyHSD(model));

console.log('\np.adjust (Holm and Hochberg):');
const p = [0.01, 0.04, 0.03];
console.log('holm:', nstat.stat.tests.p_adjust(p, 'holm'));
console.log('hochberg:', nstat.stat.tests.p_adjust(p, 'hochberg'));
console.log('BY:', nstat.stat.tests.p_adjust(p, 'BY'));
