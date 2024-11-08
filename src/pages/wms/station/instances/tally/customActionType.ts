export enum CustomActionType {
    /** 扫描SKU */
    SCAN_BARCODE = "SCAN_BARCODE",
    /** 点击确定 */
    STOCKTAKE_SUBMIT = "STOCKTAKE_SUBMIT",
    /** 领用盘点任务 */
    STOCKTAKE_EXECUTE_TASK = "STOCKTAKE_EXECUTE_TASK",
    /** 创建盘点单 */
    STOCKTAKE_CREATE_ORDER = "STOCKTAKE_CREATE_ORDER",
    /** 领用理库任务 */
    TAKE_TASK = "TAKE_TASK ",
    /** 任务重做 */
    RE_DO = "RE_DO "
}
