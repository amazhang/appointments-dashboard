var _,global,sizes,buttons,dropdown,textInput,Mousetrap,clickX,dragX;sizes={increment:4,errorText:16,subtext:20,text:22,primaryText:24,sizeNames:["xsmall","small","medium","large","xlarge"],init:function(){return this.labelText=this.subtext,this.fieldText_xsmall=this.text,this.fieldText_small=this.text,this.fieldText_medium=this.primaryText,this.errorPadding=this.increment,this.headerPadding=this.increment,this.headerPadding_small_open=this.increment,this.headerPadding_small_closed=this.increment,this.headerPadding_medium_open=2*this.increment,this.headerPadding_medium_closed=this.increment,this.prePadding=2*this.increment,this.prePadding_xsmall_closed=3*this.increment,this.postPadding=2*this.increment,this.postPadding_xsmall_closed=3*this.increment,this.prePadding_small=this.increment,this.postPadding_small=this.increment,this.button_font_small=this.fieldText_small,this.button_font_medium=this.fieldText_small,this.button_font_large=this.fieldText_small,this.button_font_xlarge=this.fieldText_medium,this.button_small=2*this.increment+this.button_font_small+2*this.increment,this.button_medium=this.prePadding_xsmall_closed+this.button_font_medium+this.postPadding_xsmall_closed,this.button_large=this.prePadding_small+this.labelText+this.headerPadding_small_closed+this.button_font_large+this.postPadding_small,this.button_xlarge=this.prePadding+this.labelText+this.headerPadding_medium_closed+this.button_font_xlarge+this.postPadding,this.button_padding_small=(this.button_small-this.button_font_small)/2,this.button_padding_medium=(this.button_medium-this.button_font_medium)/2,this.button_padding_large=(this.button_large-this.button_font_large)/2,this.button_padding_xlarge=(this.button_xlarge-this.button_font_xlarge)/2,this},getSize:function(t,e,a,o){var n=sizes[t];return void 0!==sizes[t+"_"+e+"_"+a]&&(n=sizes[t+"_"+e+"_"+a]),void 0!==sizes[t+"_"+e]&&(n=sizes[t+"_"+e]),void 0!==sizes[t+"_"+a]?n=sizes[t+"_"+a]:"noheader"===o&&"closed"===a&&"xsmall"!==e&&("prePadding"!==t&&"postPadding"!==t||(n=this.getSize("prePadding",e,a,"header"),n+=this.labelText,n+=this.getSize("headerPadding",e,a),n+=this.getSize("postPadding",e,a,"header"),n/=2)),n}}.init();var pages={current:"NA",init:function(t){var e=pages.list.inputs;dropdown.renderDropdowns(function(){var t=$(".navDropdown"),a=$(".navDropdown .option[key='"+e.hash+"']");dropdown.selectOption(a,t)},$(".nav, .slideout"));for(var a in pages.list){var o=pages.list[a];o.hash===window.location.hash.substring(1)&&(e=o)}e.init(t)},gotoPage:function(t,e){$(t.container).load(t.url,function(){$(window).scrollTop(0),$(".loading-page").removeClass("loading"),$(".shortcut-wrap").removeClass("disabled"),$(".slideout.page-settings").addClass("collapsed"),window.location.hash.substr(1)!==t.hash&&pages.updateHash(t.hash),pages.current=t.hash;var a=$(".navDropdown"),o=$(".navDropdown .option[key='"+pages.current+"']");dropdown.selectOption(o,a);var n=$("body").attr("class").split(" ");$("body").attr("class",n[0]),$("body").addClass(t.hash),e&&e()})},updateHash:function(t){window.location.hash.substr(1)!==t?window.location.hash=t:pages.init(!0)},list:{dropdowns:{container:".page-content",url:"pages/dropdowns.html",hash:"dropdowns",init:function(t){$(".loading-page").addClass("loading");var e=function(){pages.gotoPage(pages.list.dropdowns,function(){$(".dropdownRow").attr("data-custom-style","match-line-height-3"),global.renderLayouts(),dropdown.renderDropdownRows(dropdown.renderDropdowns),dropdown.selectOption($(".control.inputTheme .option[key='open']"),$(".control.inputTheme .fieldwrap"))})},a=t?500:0;setTimeout(function(){e()},a)}},inputs:{container:".page-content",url:"pages/inputs.html",hash:"inputs",init:function(t){$(".loading-page").addClass("loading");var e=function(){pages.gotoPage(pages.list.inputs,function(){global.renderLayouts(),textInput.renderTextInputRows(textInput.renderTextInputs),dropdown.selectOption($(".control.inputTheme .option[key='open']"),$(".control.inputTheme .fieldwrap"))})},a=t?500:0;setTimeout(function(){e()},a)}},typeaheads:{container:".page-content",url:"pages/typeaheads.html",hash:"typeaheads",init:function(t){$(".loading-page").addClass("loading");var e=function(){pages.gotoPage(pages.list.typeaheads,function(){$(".typeaheadRow").attr("data-custom-style","match-line-height-3"),dropdown.renderDropdownRows(dropdown.renderDropdowns),global.renderLayouts(),dropdown.selectOption($(".control.inputTheme .option[key='open']"),$(".control.inputTheme .fieldwrap"))})},a=t?500:0;setTimeout(function(){e()},a)}},buttons:{container:".page-content",url:"pages/buttons.html",hash:"buttons",init:function(t){$(".loading-page").addClass("loading");var e=function(){pages.gotoPage(pages.list.buttons,function(){$(".typeaheadRow").attr("data-custom-style","match-line-height-3"),buttons.renderLayouts(),buttons.renderButtonRows(buttons.renderButtons),dropdown.selectOption($(".control.buttonSize .option[key='medium']"),$(".control.buttonSize .fieldwrap"))})},a=t?500:0;setTimeout(function(){e()},a)}},forms:{container:".page-content",url:"pages/forms.html",hash:"forms",init:function(t){$(".loading-page").addClass("loading");var e=function(){pages.gotoPage(pages.list.forms,function(){dropdown.selectOption($(".control.formSize .option[key='small']"),$(".control.formSize .fieldwrap")),dropdown.selectOption($(".control.inputTheme .option[key='open']"),$(".control.inputTheme .fieldwrap")),dropdown.selectOption($(".control.formErrors .option[key='no']"),$(".control.formErrors .fieldwrap")),$(".control.formSize .option[key='xsmall']").addClass("disabled"),dropdown.renderDropdowns(function(){setTimeout(pages.list.forms.turnOffFormErrors,50),textInput.renderTextInputs(function(){setTimeout(buttons.renderButtons,50)})}),$(".shortcut-wrap[type=layout]").addClass("disabled").removeClass("enabled"),$(".fieldwrap.dd").addClass("match-line-height-3")})},a=t?500:0;setTimeout(function(){e()},a)},syncMiniFormButton:function(){if(pages.current===pages.list.forms.hash){var t=$(".controlWrap.theme .option.selected").attr("key"),e=$(".controlWrap.header .option.selected").attr("key"),a=$(".controlWrap.fsize .option.selected").attr("key"),o=buttons.inputSizeMap[t][a];"open"===t&&"noheader"===e&&(o="small"),$(".miniForm .buttonWrap, .form-footer .buttonWrap").removeClass("xsmall small medium large xlarge").addClass(o)}},turnOnFormErrors:function(){$(".fieldwrap.hideError").addClass("error").removeClass("hideError"),$(".fieldwrap.error .error-text").removeClass("noshow")},turnOffFormErrors:function(){$(".fieldwrap.error").removeClass("error").addClass("hideError"),$(".fieldwrap.hideError .error-text").addClass("noshow")}}}};global={transistionEnd:"webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",breakpts:{sml:710,med:1010,lrg:1490},breakpt:function(){var t=window.innerWidth,e="lrg";for(var a in global.breakpts)if(global.breakpts[a]>=t){e=a;break}return e},pxToInt:function(t){var e=t.split("px")[0];return parseInt(e)},scrollTo:function(t,e,a){var o=t.offset().top-60,n=$(window).scrollTop(),i=Math.abs(n-o),r;r=void 0===e||e?i/3:0,$("html,body").animate({scrollTop:o},r,function(){void 0!==a&&a()})},shuffleArray:function(t){for(var e=t.length,a,o;0!==e;)o=Math.floor(Math.random()*e),e-=1,a=t[e],t[e]=t[o],t[o]=a;return t},toggleLayout:function(){$(".layouts-wrap").toggleClass("off"),$(".shortcut-wrap[type=layout]").toggleClass("enabled")},toggleGrid:function(){$(".grid").toggleClass("off"),$(".shortcut-wrap[type=grid]").toggleClass("enabled")},toggleLayoutLock:function(){$(".layouts-wrap").toggleClass("locked")},closeEverything:function(){dropdown.closeAll(),$(".action-dropdown.expanded").each(function(){buttons.closeActionButton($(this).siblings(".button"))})},toggleSettingsSlideout:function(){$(".slideout.page-settings").toggleClass("collapsed")},createAnnotation:function(t,e){return e=void 0!==e?e:"",$("<div />",{class:"annotation "+e,style:"line-height:"+t+"px; height:"+t+"px; font-size: 8px;",html:t+"px"})},renderLayouts:function(){var t,e,a,o;$(".layouts-wrap").each(function(){o=$(this).siblings(".partial.row"),t=o.attr("data-theme"),e=o.attr("data-size"),a=o.attr("data-header");var n=function(o){return sizes.getSize(o,e,t,a)},i=$("<div />",{class:"fieldHeightWrapper"}),r=global.createAnnotation(n("fieldText"),"field text"),s=global.createAnnotation(n("postPadding"),"bottom padding"),d=global.createAnnotation(1,"bottom border");if(i.append(r,s,d),"header"===a&&"xsmall"!==e){var l=global.createAnnotation(n("labelText"),"label text"),p=global.createAnnotation(n("headerPadding"));i.prepend(l,p)}if("closed"===t){var c=global.createAnnotation(1,"top border"),h=global.createAnnotation(n("prePadding"),"top padding");i.prepend(c,h)}$(this).html(i);var u=$(this).find(".fieldHeightWrapper").height(),g=$("<div />",{class:"perma total-height",style:"line-height:"+u+"px;",html:u+"px"});$(this).append(g);var m=$("<div />",{class:"errorHeightWrapper"}),f=global.createAnnotation(n("errorPadding"),"error padding"),w=global.createAnnotation(sizes.errorText,"error text");m.append(f,w),$(this).append(m);var b=$(this).find(".errorHeightWrapper").height(),v=$("<div />",{class:"perma total-error",style:"line-height:"+b+"px;",html:b+"px"});$(this).append(v)}),$(".shortcut-wrap[type=layout]").hasClass("enabled")&&$(".layouts-wrap").removeClass("off")}},buttons={inputSizeMap:{closed:{xsmall:"medium",small:"large",medium:"xlarge"},open:{xsmall:"medium",small:"medium",medium:"large"}},getButtonSize:function(t){return sizes["button_"+t]},getButtonPadding:function(t){return sizes["button_"+t+"_padding"]},renderLayouts:function(){var t,e;$(".layouts-wrap").each(function(){e=$(this).siblings(".partial.row"),t=e.attr("data-size");var a=function(e){return sizes.getSize(e,t)},o=$("<div />",{class:"fieldHeightWrapper"}),n=global.createAnnotation(1,"top border"),i=global.createAnnotation(a("button_padding"),"top padding"),r=global.createAnnotation(a("button_font"),"field text"),s=global.createAnnotation(a("button_padding"),"bottom padding"),d=global.createAnnotation(1,"bottom border");o.append(n,i,r,s,d),$(this).html(o);var l=$(this).find(".fieldHeightWrapper").height(),p=$("<div />",{class:"perma total-height",style:"line-height:"+l+"px;",html:l+"px"});$(this).append(p),$(".shortcut-wrap[type=layout]").hasClass("enabled")&&$(".layouts-wrap").removeClass("off")})},renderButtons:function(t,e){var a=void 0!==e?e.find(".partial.button"):$(".partial.button");a.each(function(e){var o=$(".partial.button")[e],n=$(o),i=n.attr("data-theme"),r=n.attr("data-size"),s=n.attr("data-text"),d=n.attr("data-state"),l=void 0!==n.attr("data-custom-style")?n.attr("data-custom-style"):"",p=void 0!==n.attr("data-actions")?n.attr("data-actions").split(","):"",c=void 0!==n.attr("data-actionkeyboard")?n.attr("data-actionkeyboard").split(","):"",h=void 0!==n.attr("data-actionicons")?n.attr("data-actionicons").split(","):"";$.get("partial/_button.html",function(o){var u=$(o);if(u.addClass(i+" "+r+" "+d+" "+l),"icon-only"===d||"icon-only-action"===d?u.find(".button").html("<div class='button-icon-wrap'></div>"):u.find(".button").html(s),"action"===d||"icon-only-action"===d){for(var g=$("<div />",{class:"action-dropdown"}),m=0;m<p.length;m++){var f=$("<div />",{class:"button-action",html:"<div class='action-title'>"+p[m]+"</div>"});if(h.length>0&&f.addClass("icon "+h[m]),c.length>0){var w=c[m];w=w.replace(/cmd/g,"&#8984;"),w=w.replace(/opt/g,"&#8997;"),w=w.replace(/shift/g,"&#8679;"),w=w.replace(/\s/g,""),f.append("<div class='action-keyboard'>"+w+"</div>")}g.append(f)}u.prepend(g)}n.parent().append(u),a.length-1===e&&(a.remove(),void 0!==t&&t())})})},renderButtonRows:function(t){$(".partial.buttonRow").each(function(e){var a=$(".partial.buttonRow")[e],o=$(a),n=o.attr("data-theme"),i=o.attr("data-size"),r=o.attr("data-text"),s=o.attr("data-title"),d=o.attr("data-actions"),l=o.attr("data-actionkeyboard"),p=o.attr("data-actionicons"),c=o.attr("data-custom-style");$.get("partial/_buttonRow.html",function(e){var a=$(e);a.find(".secondaryTitle").text(s),a.find(".partial.button").each(function(){$(this).attr("data-theme",n),$(this).attr("data-size",i),$(this).attr("data-text",r),$(this).attr("data-actions",d),$(this).attr("data-actionkeyboard",l),$(this).attr("data-actionicons",p),$(this).attr("data-custom-style",c)}),o.parent().append(a),o.remove(),0===$(".partial.buttonRow").length&&void 0!==t&&t()})})},toggleActionButton:function(t){t.siblings(".action-dropdown").hasClass("expanded")?global.closeEverything():(global.closeEverything(),buttons.openActionButton(t))},openActionButton:function(t){var e=t.siblings(".action-dropdown"),a=e.find(".button-action"),o=global.pxToInt(e.css("padding-top"))+global.pxToInt(e.css("padding-bottom"))+2;a.each(function(){o+=$(this).outerHeight()}),e.offset().top+o>$(window).height()?e.addClass("goUp"):e.removeClass("goUp"),e.offset().left-e.width()<50?e.addClass("goRight"):e.removeClass("goRight"),e.addClass("expanded"),TweenLite.to(e,.2,{height:o})},closeActionButton:function(t){var e=t.siblings(".action-dropdown");e.removeClass("expanded"),TweenLite.to(e,.2,{height:"100%"})}},dropdown={close:function(t){t.removeClass("expanded"),t.find(".typeaheadInput").blur()},closeAll:function(){dropdown.close($(".dropdown.expanded"))},open:function(t){global.closeEverything(),t.addClass("expanded"),t.find(".typeaheadInput").length>0&&(t.parents(".dd").hasClass("noheader")&&t.find(".typeaheadInput").val(""),t.find(".typeaheadInput").focus())},toggle:function(t){t.hasClass("expanded")?dropdown.close(t):dropdown.open(t)},selectOption:function(t,e){t.siblings(".selected").removeClass("selected"),t.addClass("selected"),e.find(".view .selected").html(t.text()),e.addClass("nonempty"),dropdown.close(e)},renderDropdowns:function(t,e){var a="dropdown";$(".partial.typeahead").length>0&&(a="typeahead");var o=void 0!==e?e.find(".partial."+a):$(".partial."+a);o.each(function(e){var n=o[e],i=$(n),r=i.attr("data-theme"),s=i.attr("data-size"),d=i.attr("data-header"),l=i.attr("data-disabled")?"disabled":"",p=i.attr("data-selected"),c=i.attr("data-label"),h=i.attr("data-prompt"),u=i.attr("data-options").split(","),g=i.attr("data-keys").split(","),m=i.attr("data-error")?i.attr("data-error"):"",f=i.attr("data-custom-style");f=void 0!==f?f:"",$.get("partial/_"+a+".html",function(a){var n=$(a);n.addClass(r+" "+s+" "+d+" "+l+" "+f),n.find(".label").html(c),n.find(".option-prompt").html(h),n.hasClass("typeahead")&&n.find("input.typeaheadInput").attr("placeholder",c);for(var w=0;w<u.length;w++){var b=$("<div />",{class:"option",key:""+g[w],html:""+u[w]});n.find(".options").append(b)}if(w<5&&n.addClass("lessthanfive"),void 0!==p){var v=n.find(".option[key='"+p+"']");v.addClass("selected"),n.find(".view .selected").html(v.text()),n.find(".dropdown").addClass("nonempty")}m.length>0&&(n.addClass("error"),n.find(".error-text").html(m),n.find(".error-text").removeClass("noshow")),i.parent().append(n),o.length-1===e&&(o.remove(),void 0!==t&&t())})})},renderDropdownRows:function(t){var e="dropdown";$(".partial.typeaheadRow").length>0&&(e="typeahead");var a=$(".partial."+e+"Row");a.each(function(o){var n=a[o],i=$(n),r=i.attr("data-theme"),s=i.attr("data-size"),d=i.attr("data-header"),l=i.attr("data-title"),p=i.attr("data-custom-style");$.get("partial/_"+e+"Row.html",function(a){var o=$(a);o.find(".secondaryTitle").text(l),o.find(".partial."+e).each(function(){$(this).attr("data-theme",r),$(this).attr("data-size",s),$(this).attr("data-header",d),$(this).attr("data-custom-style",p)}),i.parent().append(o),i.remove(),0===$(".partial."+e+"Row").length&&void 0!==t&&t()})})},searchTypeahead:function(t,e){for(var a=[],o=0;o<t.find(".option").length;o++){a[o]=t.find(".option").eq(o),a[o].addClass("noshow");var n=a[o].find(".query-match").contents();a[o].find(".query-match").replaceWith(n),a[o].html(a[o].text())}return _.filter(a,function(t){var a=t.text();if(a.toLowerCase().includes(e.toLowerCase())){t.removeClass("noshow");var o=a.toLowerCase().indexOf(e.toLowerCase()),n=o+e.length;return t.html(a.substring(0,o)+"<span class='query-match'>"+a.substring(o,n)+"</span>"+a.substr(n)),!0}return!1})}},textInput={renderTextInputs:function(t,e){var a=void 0!==e?e.find(".partial.textInput"):$(".partial.textInput");a.each(function(e){var o=$(".partial.textInput")[e],n=$(o),i=n.attr("data-theme"),r=n.attr("data-size"),s=n.attr("data-header"),d=!!n.attr("data-disabled"),l=n.attr("data-label"),p=n.attr("data-value"),c=n.attr("data-error")?n.attr("data-error"):"";$.get("partial/_textInput.html",function(o){var h=$(o);h.addClass(i+" "+r+" "+s),h.find("label").text(l),h.find("input").attr("placeholder",l),void 0!==p&&h.find("input").val(p).addClass("nonempty"),d&&h.find("input").attr("disabled","true").addClass("disabled"),c.length>0&&(h.addClass("error"),h.find(".error-text").html(c),h.find(".error-text").removeClass("noshow")),n.parent().append(h),a.length-1===e&&(a.remove(),void 0!==t&&t())})})},renderTextInputRows:function(t){$(".partial.textInputRow").each(function(e){var a=$(".partial.textInputRow")[e],o=$(a),n=o.attr("data-theme"),i=o.attr("data-size"),r=o.attr("data-header"),s=o.attr("data-title");$.get("partial/_textInputRow.html",function(e){var a=$(e);a.find(".secondaryTitle").text(s),a.find(".partial.textInput").each(function(){$(this).attr("data-theme",n),$(this).attr("data-size",i),$(this).attr("data-header",r)}),o.parent().append(a),o.remove(),0===$(".partial.textInputRow").length&&void 0!==t&&t()})})}},$(document).ready(function(){pages.init(!1),$.History.bind(function(){pages.init(!0)}),$(window).scroll(function(){$("body").scrollTop()>0?$(".headerSection").addClass("scrolled"):$(".headerSection").removeClass("scrolled")}),$(window).resize(function(){setTimeout(function(){$(".action-dropdown.expanded").each(function(){$(this).offset().left+300>$(document).width()?$(this).addClass("goLeft"):$(this).removeClass("goLeft")})},500)}),Mousetrap.bind("ctrl+g",function(){global.toggleGrid()}),Mousetrap.bind("ctrl+l",function(){$(".shortcut-wrap[type=layout]").hasClass("disabled")||global.toggleLayout()}),Mousetrap.bind("shift+ctrl+l",function(){global.toggleLayoutLock()}),$(document).on("click",".shortcut-wrap.settings, .slideout.page-settings .close",function(t){t.stopPropagation(),global.toggleSettingsSlideout()}),$(document).on("change",".fieldwrap input[type='text']",function(){$(this).val().length>0?$(this).addClass("nonempty"):$(this).removeClass("nonempty")}),$(document).on("mousedown",".option-prompt, .dropdown .view",function(t){clickX=t.clientX}),$(document).on("mousemove",".option-prompt, .dropdown .view",function(t){dragX=t.clientX}),$(document).on("click","input.typeaheadInput",function(t){t.stopPropagation()}),$(document).on("click",".fieldwrap.dd:not(.disabled), .option-prompt",function(t){if(t.stopPropagation(),!(Math.abs(clickX-dragX)>8)){var e=$(this).hasClass("dd")?$(this).find(".dropdown"):$(this).parents(".dd").find(".dropdown");dropdown.toggle(e)}}),$(document).on("click",".dd .option:not(.disabled)",function(t){t.stopPropagation(),dropdown.selectOption($(this),$(this).parents(".dropdown"));var e=$(this).attr("key");if($(this).parents(".control.navDropdown").length>0)window.location.hash=e;else if($(this).parents(".control.buttonSize").length>0)$(".example-shell .buttonWrap").removeClass("xsmall small medium large xlarge").addClass(e),$("section").each(function(t){var a=$("<div />",{class:"partial row buttonRow","data-size":e});$($("section")[t]).append(a)}),buttons.renderLayouts(),$(".partial.buttonRow").remove();else if($(this).parents(".control.formSize").length>0){for(var a=0;a<$(".formfield-wrapper .fieldwrap").length;a++){var o=$($(".formfield-wrapper .fieldwrap")[a]);o.removeClass("xsmall small medium large xlarge").addClass(e)}pages.list.forms.syncMiniFormButton()}else if($(this).parents(".control.header").length>0)$(".formfield-wrapper .fieldwrap").removeClass("header noheader"),$(".formfield-wrapper .fieldwrap").addClass(e),pages.list.forms.syncMiniFormButton();else if($(this).parents(".control.formErrors").length>0)"no"===e?pages.list.forms.turnOffFormErrors():"yes"===e&&pages.list.forms.turnOnFormErrors();else if($(this).parents(".control.backgroundColor").length>0)$("body").removeClass("gray white").addClass(e);else if($(this).parents(".control.inputTheme").length>0){var n=$(".example-shell .fieldwrap, .formfield-wrapper .fieldwrap");n.removeClass("open closed"),n.addClass(e),pages.current===pages.list.forms.hash&&("closed"===e?$(".controlWrap.fsize .option[key=xsmall]").removeClass("disabled"):($(".controlWrap.header .fieldwrap .option[key=header]").removeClass("disabled"),$(".controlWrap.fsize .option[key=xsmall]").hasClass("selected")&&(dropdown.selectOption($(".controlWrap.fsize .option[key=small]"),$(".controlWrap.fsize .dropdown")),$(".formfield-wrapper .fieldwrap").removeClass("xsmall").addClass("small"),$(".formfield-wrapper .fieldwrap").removeClass("noheader").addClass("header"),dropdown.selectOption($(".controlWrap.header .fieldwrap .option[key=header]"),$(".controlWrap.header .fieldwrap"))),$(".controlWrap.fsize .option[key=xsmall]").addClass("disabled")),pages.list.forms.syncMiniFormButton()),$(".layouts-wrap").each(function(t){var e=$($(".layouts-wrap")[t]),a=e.siblings(".content").find(".example-shell:nth-child(2)");a=a.find(".fieldwrap");var o=$("<div />",{class:"partial row","data-theme":a.hasClass("open")?"open":"closed","data-size":a.hasClass("small")?"small":"medium","data-header":a.hasClass("header")?"header":"noheader"}),n=e.siblings(".content").find(".secondaryTitle"),i=n.text().indexOf(" "),r=n.text().substr(i);a.hasClass("closed")?($("section:first-child, section:nth-child(2)").removeClass("noshow"),$("section:first-child .partial.row, section:nth-child(2) .partial.row").attr("data-size","xsmall"),n.html("Closed "+r)):($("section:first-child, section:nth-child(2)").addClass("noshow"),n.html("Open "+r)),e.parent().append(o)}),global.renderLayouts(),$(".partial.row").remove()}}),$(document).on("click","body, form, .content",function(t){t.stopPropagation(),global.closeEverything()}),$(document).on("click",".shortcut-wrap",function(t){t.stopPropagation();var e=$(this).attr("type");"layout"===e?global.toggleLayout():"grid"===e&&global.toggleGrid()}),$(document).on("input","input.typeaheadInput",function(){var t=$(this);t.parents(".dropdown").addClass("loading"),setTimeout(function(){t.parents(".dropdown").removeClass("loading"),0===dropdown.searchTypeahead(t.parents(".typeahead"),t.val()).length?t.parents(".dropdown").addClass("empty"):t.parents(".dropdown").removeClass("empty")},Math.round(300*Math.random())+200)}),$(document).on("click",".buttonWrap.action .button, .buttonWrap.icon-only-action .button",function(t){t.stopPropagation(),buttons.toggleActionButton($(this))}),$(document).on("click",".xsmall.header .label",function(){$(this).siblings("input[type='text']").focus()})});