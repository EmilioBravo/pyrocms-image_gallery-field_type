Image Gallery Field Type for PyroCMS
====================================

Creates a folder for every stream entry an then allows the user to upload image files to it.

## Requirements

* jquery-filedrop, it's already included, but I had to [modify the original] (https://github.com/EmilioBravo/jquery-filedrop/commit/8b2a9f4b8300846a7e7ca01e96d35c5a3502958b "See the diff in github") to make it work with PyroCMS.
* field_asset.php, I've [modified it] (https://github.com/EmilioBravo/pyrocms/commit/846d6e781b5f64bdf64f426455546a62675499f5 "See the diff in github") to allow images from the field type.

## How to use it

1. Install the field type by copying it to your addons/[your-site]/fiels_types/ folder
2. Add the field type to a stream, for example: a custom page layout
3. Select a pre-existing folder (every entry will create a new folder inside this one)
4. Enjoy!