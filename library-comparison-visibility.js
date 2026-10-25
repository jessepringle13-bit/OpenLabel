(function(root){'use strict';
var css='#library[data-tab="saved"] > #olSavedFoodComparison:not([hidden]){display:block!important}#library:not([data-tab="saved"]) > #olSavedFoodComparison{display:none!important}';
if(typeof module==='object'&&module.exports){module.exports={css:css};return}if(root.OLComparisonVisibility)return;var style=root.document.createElement('style');style.id='olComparisonVisibilityStyle';style.textContent=css;root.document.head.append(style);root.OLComparisonVisibility={version:'20261025-savedvisibility1'};
})(typeof window==='object'?window:globalThis);
