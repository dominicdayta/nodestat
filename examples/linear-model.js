const nstat = require('../index.js');

const women = nstat.stat.dataset('women');
const model = nstat.lm('weight ~ height', women);

console.log('Coefficients:', model.coef());
console.log('Summary:', model.summary());
console.log('Coefficient table:');
console.log(model.coeftable().print());
console.log('ANOVA F-test:', model.aov());

const augmented = women.cbind(model.residuals).cbind(model.fitted_values);
console.log('\nAugmented columns:', augmented.columns());
console.log(augmented.head(3).print());

const poly = nstat.lm('weight ~ I(height^2)', women);
console.log('\nPolynomial model coef:', poly.coef());

const sleep = nstat.stat.dataset('sleep');
const groupModel = nstat.lm('extra ~ group', sleep);
console.log('\nCategorical predictor coef:', groupModel.coef());
