// barcode parse rule module
export const api_barcode_parse_rule_add = "post:/mdm/barcodeParseRule/createOrUpdate"
export const api_barcode_parse_rule_update = "post:/mdm/barcodeParseRule/createOrUpdate"
export const api_barcode_parse_rule_get = "get:/mdm/barcodeParseRule/${id}"

// batch attribute module
export const api_batch_attribute_add = "post:/mdm/batchAttributeConfig/createOrUpdate"
export const api_batch_attribute_update = "post:/mdm/batchAttributeConfig/createOrUpdate"
export const api_batch_attribute_get = "/mdm/batchAttributeConfig/${id}"

// dictionary module
export const api_dictionary_add = "post:/mdm/dictionary/createOrUpdate"
export const api_dictionary_update = "post:/mdm/dictionary/createOrUpdate"
export const api_dictionary_get = "get:/mdm/dictionary/${id}";

// param config module
export const api_param_config_add = "post:/mdm/parameterConfig/createOrUpdate"
export const api_param_config_update = "post:/mdm/parameterConfig/createOrUpdate"
export const api_param_config_get = "get:/mdm/parameterConfig/${id}"

// international app-management module
export const api_app_add = "post:/mdm/app-management/add"
export const api_app_update = "post:/mdm/app-management/update"
export const api_app_delete = "delete:/mdm/app-management/${id}"

// international entry-management module
export const api_entry_get = "/mdm/entry-management/${id}"
export const api_entry_add = "post:/mdm/entry-management/add"
export const api_entry_update = "post:/mdm/entry-management/update"
export const api_entry_delete = "delete:/mdm/entry-management/${id}"
export const api_entry_upload = "post:/mdm/entry-management/uploadEntries"