// warehouse module
export const api_warehouse_add =
    "post:/wms/basic/warehouseMainData/createOrUpdate"
export const api_warehouse_update =
    "post:/wms/basic/warehouseMainData/createOrUpdate"
export const api_warehouse_get = "post:/wms/basic/warehouseMainData/${id}"

// owner module
export const api_owner_add = "post:/wms/basic/ownerMainData/createOrUpdate"
export const api_owner_update = "post:/wms/basic/ownerMainData/createOrUpdate"
export const api_owner_get = "post:/wms/basic/ownerMainData/${id}"

// sku module
export const api_sku_add = "post:/wms/basic/skuMainData/createOrUpdate"
export const api_sku_update = "post:/wms/basic/skuMainData/createOrUpdate"
export const api_sku_get = "post:/wms/basic/skuMainData/${id}"

// barcode parse rule module
export const api_barcode_parse_rule_add =
    "post:/wms/config/barcodeParseRule/createOrUpdate"
export const api_barcode_parse_rule_update =
    "post:/wms/config/barcodeParseRule/createOrUpdate"
export const api_barcode_parse_rule_get =
    "post:/wms/config/barcodeParseRule/${id}"

// batch attribute module
export const api_batch_attribute_add =
    "post:/wms/config/batchAttributeConfig/createOrUpdate"
export const api_batch_attribute_update =
    "post:/wms/config/batchAttributeConfig/createOrUpdate"
export const api_batch_attribute_get =
    "post:/wms/config/batchAttributeConfig/${id}"

// dictionary module
export const api_dictionary_add = "post:/wms/config/dictionary/createOrUpdate"
export const api_dictionary_update =
    "post:/wms/config/dictionary/createOrUpdate"
export const api_dictionary_get = "post:/wms/config/dictionary/${id}"

// param config module
export const api_param_config_add =
    "post:/wms/config/parameterConfig/createOrUpdate"
export const api_param_config_update =
    "post:/wms/config/parameterConfig/createOrUpdate"
export const api_param_config_get = "post:/wms/config/parameterConfig/${id}"

// system config module
export const api_system_config_save_or_update =
    "post:/wms/config/systemConfig/createOrUpdate"
export const api_system_config_get = "post:/wms/config/systemConfig/get"
