<?php defined('BASEPATH') or exit('No direct script access allowed');

/**
 * PyroStreams Image Gallery Field Type
 *
 * @package		Addons\Modules\Streams Core\Field Types
 * @author		Luis Escobar Bravo
 * @copyright	Copyright (c) 2013, Luis Escobar Bravo
 */
class Field_image_gallery
{
	public $field_type_slug				= 'image_gallery';
	
	public $db_col_type					= 'int';

	public $version						= '1.0.0';
	
	public $author						= array('name' => 'Luis Escobar Bravo', 'url' => 'http://www.intangible.com.py');
	
	public $custom_parameters			= array('folder');

	// --------------------------------------------------------------------------

	/**
	 * Output form input
	 *
	 * @param	array
	 * @param	array
	 * @return	string
	 */
	public function form_output($data)
	{
		$output = '';
		if($data['value']==''){
			$folder_id = 0;
		}else{
			$folder_id = $data['value'];
		}

		$output .= '<input type="hidden" name="' . $data['form_slug'] . '" id="folder_id" value="' . $folder_id . '" />';

		if($folder_id){

			$output .= '<div id="dropbox">';

			$this->CI->load->library('files/files');

			$folder_contents = Files::folder_contents($folder_id);
			$folder_files = $folder_contents['data']['file'];
			if(count($folder_files)>0){

				foreach($folder_files as $file){
					$output .= '<div class="preview" id="' . $file->id . '">
					<div class="delete">x</div>
					<span class="imageHolder">
					<img src="/files/large/' . $file->filename . '" />
					<span class="uploaded"></span>
					</span>
					</div>';
				}



			}else{

				$output .= '<span class="message" style="">'.lang('streams:image_gallery.upload_empty_message').'</span>';
			}

			$output .=		'</div>';


		}else{

			$output .= '<p class="alert-info">'.lang('streams:image_gallery.save_first_message').'</p>';

		}


		$this->CI->type->add_js('image_gallery', 'jquery.filedrop.js');
		$this->CI->type->add_js('image_gallery', 'image_galleryfield.js');
		$this->CI->type->add_css('image_gallery', 'image_galleryfield.css');		
		return $output;
	}

	// --------------------------------------------------------------------------

	/**
	 * Pre Output
	 *
	 * No PyroCMS tags in email fields.
	 *
	 * @return string
	 */
	public function pre_output($input)
	{
		if(is_null($input)){
			$input = 0;
		}
		return $input;
	}


	// --------------------------------------------------------------------------

	/**
	 * Process before saving to database
	 *
	 * @access	public
	 * @param	array
	 * @param	obj
	 * @return	string
	 */
	public function pre_save($input, $field, $stream, $row_id, $form_data)
	{

		if(!is_null($row_id)){

			$this->CI->load->driver('Streams');
			$entry = $this->CI->streams->entries->get_entry($row_id, $stream->stream_slug, $stream->stream_namespace);
			if(empty($entry->{$field->field_slug})){

				$this->CI->load->library('files/files');
				$folder = Files::create_folder($field->field_data['folder'], $form_data['title']);
				return $folder['data']['id'];
			}else{
				return $input;
			}

		}else{
				$this->CI->load->library('files/files');
				$folder = Files::create_folder($field->field_data['folder'], $form_data['title']);
				return $folder['data']['id'];

		}

		return $input;
	}

	// --------------------------------------------------------------------------

	/**
	 * Choose a folder to upload to.
	 *
	 * @access	public
	 * @param	[string - value]
	 * @return	string
	 */
	public function param_folder($value = null)
	{
		// Get the folders
		$this->CI->load->model('files/file_folders_m');

		$tree = $this->CI->file_folders_m->get_folders();

		$tree = (array)$tree;

		if ( ! $tree)
		{
			return '<em>'.lang('streams:image.need_folder').'</em>';
		}

		$choices = array();

		foreach ($tree as $tree_item)
		{
			// We are doing this to be backwards compat
			// with PyroStreams 1.1 and below where
			// This is an array, not an object
			$tree_item = (object)$tree_item;

			$choices[$tree_item->id] = $tree_item->name;
		}

		return form_dropdown('folder', $choices, $value);
	}

}