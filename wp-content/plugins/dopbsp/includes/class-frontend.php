<?php

/*
* Title                   : Pinpoint Booking System WordPress Plugin (PRO)
* Version                 : 2.1.1
* File                    : includes/class-frontend.php
* File Version            : 1.0.9
* Created / Last Modified : 25 August 2015
* Author                  : Dot on Paper
* Copyright               : © 2012 Dot on Paper
* Website                 : http://www.dotonpaper.net
* Description             : Front end PHP class.
*/

    if (!class_exists('DOPBSPFrontEnd')){
        class DOPBSPFrontEnd{
            /*
             * Constructor
             */
            function __construct(){
                add_action('wp_enqueue_scripts', array(&$this, 'addStyles'));
                add_action('wp_enqueue_scripts', array(&$this, 'addScripts'));
                
                add_shortcode('dopbsp', array(&$this, 'shortcode'));
            }
            
            /*
             * Add plugin's CSS files.
             */
            function addStyles(){
                global $DOPBSP;
                
                /*
                 * Register styles.
                 */
                wp_register_style('DOPBSP-css-dopselect', $DOPBSP->paths->url.'libraries/css/jquery.dop.Select.css');

                /*
                 * Enqueue styles.
                 */
                wp_enqueue_style('DOPBSP-css-dopselect');
            }
            
            /*
             * Add plugin's JavaScript files.
             */
            function addScripts(){
                global $DOPBSP;
                
                wp_register_script('DOP-js-jquery-dopselect', $DOPBSP->paths->url.'libraries/js/jquery.dop.Select.js', array('jquery'), false, true);
                
                wp_register_script('DOPBSP-js-frontend-calendar', $DOPBSP->paths->url.'assets/js/jquery.dop.frontend.BSPCalendar.js', array('jquery'), false, true);
                wp_register_script('DOPBSP-js-frontend-search', $DOPBSP->paths->url.'assets/js/jquery.dop.frontend.BSPSearch.js', array('jquery'), false, true);

                /*
                 *  Enqueue JavaScript.
                 */
                if (!wp_script_is('jquery', 'queue')){
                    wp_enqueue_script('jquery');
                }
                
                if (!wp_script_is('jquery-ui-datepicker', 'queue')){
                    wp_enqueue_script('jquery-ui-datepicker');
                }
                
                if (!wp_script_is('jquery-ui-slider', 'queue')){
                    wp_enqueue_script('jquery-ui-slider');
                }
                
                wp_enqueue_script('DOP-js-jquery-dopselect');
                
                wp_enqueue_script('DOPBSP-js-frontend-calendar');
                wp_enqueue_script('DOPBSP-js-frontend-search');
            }

            /*
             * Initialize shortcode.
             * 
             * @param atts (array): shortcode attributes
             */
            function shortcode($atts){
                global $DOPBSP;
                
                extract(shortcode_atts(array('class' => 'dopbsp'), $atts));
                                
                if (!array_key_exists('item', $atts)){
                    $atts['item'] = 'calendar';
                }
                                
                if (!array_key_exists('id', $atts)){
                    $atts['id'] = 1;
                }
                                
                if (!array_key_exists('lang', $atts)){
                    $atts['lang'] = DOPBSP_CONFIG_TRANSLATION_DEFAULT_LANGUAGE;
                }
                                
                if (!array_key_exists('woocommerce', $atts)){
                    $atts['woocommerce'] = 'false';
                }
                                
                if (!array_key_exists('woocommerce_add_to_cart', $atts)){
                    $atts['woocommerce_add_to_cart'] = 'false';
                }
                                
                if (!array_key_exists('woocommerce_position', $atts)){
                    $atts['woocommerce_position'] = 'summary';
                }
                                
                if (!array_key_exists('woocommerce_product_id', $atts)){
                    $atts['woocommerce_product_id'] = 0;
                }
                
                switch ($atts['item']){
                    case 'search':
                        $content = $DOPBSP->classes->frontend_search->display($atts);
                        break;
                    default:
                        $content = $DOPBSP->classes->frontend_calendar->display($atts);
                }
                
                return $content;
            }
        }
    }