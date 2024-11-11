// warehouse module
export const api_warehouse_add = "post:/mdm/basic/warehouseMainData/createOrUpdate";
export const api_warehouse_update = "post:/mdm/basic/warehouseMainData/createOrUpdate";
export const api_warehouse_get = "get:/mdm/basic/warehouseMainData/${id}";

// owner module
export const api_owner_add = "post:/mdm/basic/ownerMainData/createOrUpdate";
export const api_owner_update = "post:/mdm/basic/ownerMainData/createOrUpdate";
export const api_owner_get = "get:/mdm/basic/ownerMainData/${id}";

// sku module
export const api_sku_add = "post:/mdm/basic/skuMainData/createOrUpdate"
export const api_sku_update = "post:/mdm/basic/skuMainData/createOrUpdate"
export const api_sku_get = "get:/mdm/basic/skuMainData/${id}";

// barcode parse rule module
export const api_barcode_parse_rule_add = "post:/mdm/config/barcodeParseRule/createOrUpdate"
export const api_barcode_parse_rule_update = "post:/mdm/config/barcodeParseRule/createOrUpdate"
export const api_barcode_parse_rule_get = "get:/mdm/config/barcodeParseRule/${id}"

// batch attribute module
export const api_batch_attribute_add = "post:/mdm/config/batchAttributeConfig/createOrUpdate"
export const api_batch_attribute_update = "post:/mdm/config/batchAttributeConfig/createOrUpdate"
export const api_batch_attribute_get = "/mdm/config/batchAttributeConfig/${id}"

// dictionary module
export const api_dictionary_add = "post:/mdm/config/dictionary/createOrUpdate"
export const api_dictionary_update = "post:/mdm/config/dictionary/createOrUpdate"
export const api_dictionary_get = "get:/mdm/config/dictionary/${id}";

// param config module
export const api_param_config_add = "post:/mdm/config/parameterConfig/createOrUpdate"
export const api_param_config_update = "post:/mdm/config/parameterConfig/createOrUpdate"
export const api_param_config_get = "get:/mdm/config/parameterConfig/${id}"

// system config module
export const api_system_config_save_or_update = "post:/mdm/config/systemConfig/createOrUpdate"
export const api_system_config_get = "get:/mdm/config/systemConfig/get"
