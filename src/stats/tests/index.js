'use strict';

const tTest = require('./ttest.js');
const wilcoxTest = require('./wilcoxon.js');
const { aov, tukeyHSD } = require('./anova.js');
const pAdjust = require('./adjustments.js');

module.exports = {
    t_test: tTest,
    wilcox_test: wilcoxTest,
    aov,
    tukeyHSD,
    p_adjust: pAdjust,
    't.test': tTest,
    'wilcox.test': wilcoxTest,
    'p.adjust': pAdjust,
};
