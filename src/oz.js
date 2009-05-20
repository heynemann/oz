jQuery.fn.oz = function(options) {
    return this.each(function(){
        wiz = jQuery(this);

        //Sets defaults
        settings = jQuery.extend({
            next_step_selector: "a.next",
            prev_step_selector: "a.previous",
            step_selector:'div.step_{step_index}'
        }, options);

        wiz.hide();
        current_step = parseInt(wiz.attr('current_step_index'));
        if (isNaN(current_step)) current_step = 1;
        wiz.attr('current_step_index', current_step);

        wiz_id = wiz.attr('id');
        assert_wizard_id(wiz_id);

        wizard_template_element_selector = wiz.attr('template');
        assert_wizard_template_selector(wizard_template_element_selector);

        html_wizard = jQuery(wizard_template_element_selector).html();
        div_wizard_id = 'wiz' + wiz_id;
        wiz.before('<div id="' + div_wizard_id + '"></div>');
        div_wizard = jQuery('#' + div_wizard_id);
        div_wizard.append(html_wizard);

        wizard_body = div_wizard.find('div.body');

        create_navigation_steps(wiz, wizard_body);
        total_steps = wizard_body.children('div').length;
        wiz.attr('total_steps', total_steps);

        prev_step = div_wizard.find(settings.prev_step_selector);
        next_step = div_wizard.find(settings.next_step_selector);
        assert_navigation_links(prev_step, next_step);

        enable_navigation_links(total_steps, current_step, prev_step, next_step);

        prev_step.click(function(){
            navigate_step($(this), wiz, wizard_body, settings, -1);
        });
        next_step.click(function(){
            navigate_step($(this), wiz, wizard_body, settings, 1);
        });

        navigate_step(null, wiz, wizard_body, settings, 0);
    });
    
    function navigate_step(step, wiz, wizard_body, settings, offset){
        if (step && step.attr('disabled'))
            return;

        current_step = parseInt(wiz.attr('current_step_index')) + offset;
        total_steps = wizard_body.children('div').length;

        if (settings.pre_previous)
            settings.pre_previous(current_step);

        wizard_body.children('div').hide();
        current_step_selector = settings.step_selector.replace("{step_index}", current_step);
        current_step_div = wizard_body.find(current_step_selector);
        current_step_div.show();

        wiz.attr('current_step_index', current_step);

        if (settings.post_previous)
            settings.post_previous(current_step);

        enable_navigation_links(total_steps, current_step, settings);

        return false;
    }
    
    function enable_navigation_links(number_of_steps, current_step, settings){
        prev_link = div_wizard.find(settings.prev_step_selector);
        next_link = div_wizard.find(settings.next_step_selector);
        prev_link.removeAttr('disabled');
        next_link.removeAttr('disabled');
        if (current_step == 1){
            prev_link.attr('disabled', true);
        }
        if (current_step == number_of_steps){
            next_link.attr('disabled', true);
        }
    }

    function create_navigation_steps(wiz, wizard_body){
        navigation_steps = wiz.find('li');
        navigation_steps.each(function(){
            step = $(this);
            step_div_class = step.attr('class');
            wizard_body.append('<div class="' + step_div_class + '"></div>');
            step_div = wizard_body.find('div.' + step_div_class);
            step_html = step.html();

            step_div.append(step_html);
            step_div.hide();
            step.remove();
        });
    }

    function assert_wizard_id(wizard_id){
        if (!wizard_id){
            alert('You need to specify an id for the wizard (ul element).');
            throw "No id attribute specified.";
        }
    }

    function assert_navigation_links(prev_step, next_step){
        if (!prev_step || !next_step || prev_step.length == 0 || next_step.length == 0){
            alert('No next or previous link found inside wizard template.');
            throw "No navigation link found.";
        }
    }

    function assert_wizard_template_selector(wizard_template_element_selector){
        if (!wizard_template_element_selector){
            alert('You need to specify a template for the wizard in the "template" attribute for the ul element.');
            throw "No template attribute specified.";
        }
    }
};
