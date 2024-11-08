// warehouse module
export const api_warehouse_add = "post:/mdm/warehouseMainData/createOrUpdate";
export const api_warehouse_update = "post:/mdm/warehouseMainData/createOrUpdate";
export const api_warehouse_get = "get:/mdm/warehouseMainData/${id}";

// owner module
export const api_owner_add = "post:/mdm/ownerMainData/createOrUpdate";
export const api_owner_update = "post:/mdm/ownerMainData/createOrUpdate";
export const api_owner_get = "get:/mdm/ownerMainData/${id}";

// sku module
export const api_sku_add = "post:/mdm/skuMainData/createOrUpdate"
export const api_sku_update = "post:/mdm/skuMainData/createOrUpdate"
export const api_sku_get = "get:/mdm/skuMainData/${id}";

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

// system config module
export const api_system_config_save_or_update = "post:/mdm/systemConfig/createOrUpdate"

export const api_system_config_get = "get:/mdm/systemConfig/get"