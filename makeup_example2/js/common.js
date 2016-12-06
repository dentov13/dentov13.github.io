$(document).ready(function() {
	// Scroll
	$(window).scroll(function(){
		var scroll = $(this).scrollTop();
		if (scroll > 20) {
			$('#nav').addClass('active');
		}
		else {
			$('#nav').removeClass('active');
		};
	});

	// Price
	var individualPrice = $('#price_tables').find('.individual');
	var companyPrice = $('#price_tables').find('.company');

	$('.switch-toggles').find('.individual').addClass('active');
	$('#price_tables').find('.individual').addClass('active');

	$('.switch-toggles').find('.individual').on('click', function(){
		$(this).addClass('active');
		$(this).closest('.switch-toggles').removeClass('active');
		$(this).siblings().removeClass('active');
		individualPrice.addClass('active');
		companyPrice.removeClass('active');
	});

	$('.switch-toggles').find('.company').on('click', function(){
		$(this).addClass('active');
		$(this).closest('.switch-toggles').addClass('active');
		$(this).siblings().removeClass('active');
		companyPrice.addClass('active');
		individualPrice.removeClass('active');
	});
});
