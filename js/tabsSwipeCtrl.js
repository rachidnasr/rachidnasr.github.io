function tabsSwipeCtrlFn() {
	var responsive = this;
	responsive.ngIncludeTemplates = [{
		index: 0,
		name: 'start',
		url: 'start.html'
	}, {
		index: 1,
		name: 'about',
		url: 'about.html'
	}, {
		index: 2,
		name: 'gallery',
		url: 'gallery.html'
	}, {
		index: 3,
		name: 'showreel',
		url: 'showreel.html'
	}, {
		index: 4,
		name: 'pictures',
		url: 'showreel.html'
	}, {
		index: 5,
		name: 'generative art',
		url: 'genart.html'
	}, {
		index: 6,
		name: 'blog',
		url: 'showreel.html'
	}, {
		index: 7,
		name: 'contact',
		url: 'contact.html'
	}];
	responsive.selectPage = selectPage;

	/**
	 * Initialize with the first page opened
	 */
	responsive.ngIncludeSelected = responsive.ngIncludeTemplates[0];

	/**
	 * @name selectPage
	 * @desc The function that includes the page of the indexSelected
	 * @param indexSelected the index of the page to be included
	 */
	function selectPage(indexSelected) {
		if (responsive.ngIncludeTemplates[indexSelected].index > responsive.ngIncludeSelected.index) {
			responsive.moveToLeft = false;
		} else {
			responsive.moveToLeft = true;
		}
		responsive.ngIncludeSelected = responsive.ngIncludeTemplates[indexSelected];
	}
}

var app = angular.module('myApp', ['ngAnimate', 'ngTouch'])
	.controller('tabsSwipeCtrl', tabsSwipeCtrlFn);