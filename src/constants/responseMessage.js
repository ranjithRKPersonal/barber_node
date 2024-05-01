const responseMessages = {
  // category

  CREATE_CATEGORY_SUCCESS: 'Category created successfully',
  CREATE_CATEGORY_FAILED: 'Failed to create category',
  EDIT_CATEGORY_SUCCESS: 'Category edit successfully',
  EDIT_CATEGORY_FAILED: 'Failed to edit category',
  DELETE_CATEGORY_SUCCESS: 'Category delete successfully',
  DELETE_CATEGORY_FAILED: 'Failed to delete category',
  GET_CATEGORY_SUCCESS: 'Category get successfully',
  GET_CATEGORY_FAILED: 'Failed to get category',
  GET_ALL_CATEGORY_SUCCESS: 'Category get all successfully',
  GET_ALL_CATEGORY_FAILED: 'Failed to get all category',

  // Service

  CREATE_SERVICE_SUCCESS: 'Service created successfully',
  CREATE_SERVICE_FAILED: 'Failed to create service',
  EDIT_SERVICE_SUCCESS: 'Service edit successfully',
  EDIT_SERVICE_FAILED: 'Failed to edit service',
  DELETE_SERVICE_SUCCESS: 'Service delete successfully',
  DELETE_SERVICE_FAILED: 'Failed to delete service',
  GET_SERVICE_SUCCESS: 'Service get successfully',
  GET_SERVICE_FAILED: 'Failed to get service',
  GET_ALL_SERVICE_SUCCESS: 'Service get all successfully',
  GET_ALL_SERVICE_FAILED: 'Failed to get all service',
  GET_ALL_SERVICE_BY_CATEGORY_SUCCESS:
    'Service get service list by category successfully',
  GET_ALL_SERVICE_BY_CATEGORY_FAILED: 'Failed to get service list by category',

  // client

  CREATE_CLIENT_SUCCESS: 'Client created successfully',
  CREATE_CLIENT_FAILED: 'Failed to create client',
  EDIT_CLIENT_SUCCESS: 'Client edit successfully',
  EDIT_CLIENT_FAILED: 'Failed to edit client',
  DELETE_CLIENT_SUCCESS: 'Client delete successfully',
  DELETE_CLIENT_FAILED: 'Failed to delete client',
  GET_CLIENT_SUCCESS: 'Client get successfully',
  GET_CLIENT_FAILED: 'Failed to get client',
  GET_ALL_CLIENT_SUCCESS: 'Client get all successfully',
  GET_ALL_CLIENT_FAILED: 'Failed to get all client',
  LOGIN_CLIENT_SUCCESS: 'Login successfully',
  LOGIN_CLIENT__FAILED: 'Failed to login',

  // appointment

  CREATE_APPOINTMENT_SUCCESS: 'Appointment booked successfully',
  CREATE_APPOINTMENT_FAILED: 'Failed to book appointment',
  EDIT_APPOINTMENT_SUCCESS: 'Appointment edit successfully',
  EDIT_APPOINTMENT_FAILED: 'Failed to edit appointment',
  DELETE_APPOINTMENT_SUCCESS: 'Appointment delete successfully',
  DELETE_APPOINTMENT_FAILED: 'Failed to delete appointment',
  GET_APPOINTMENT_SUCCESS: 'Appointment get successfully',
  GET_APPOINTMENT_FAILED: 'Failed to get appointment',
  GET_ALL_APPOINTMENT_SUCCESS: 'Appointment get all successfully',
  GET_ALL_APPOINTMENT_FAILED: 'Failed to get all appointment',
  EDIT_APPOINTMENT_STATUS_SUCCESS: 'Appointment status edit successfully',
  EDIT_APPOINTMENT_STATUS_FAILED: 'Failed to edit appointment status',

  GET_ALL_OVERVIEW_SUCCESS: 'Overview get all successfully',
  GET_ALL_OVERVIEW_FAILED: 'Failed to get all Overview',
  // invoice

  CREATE_INVOICE_SUCCESS: 'Invoice created successfully',
  CREATE_INVOICE_FAILED: 'Failed to create invoice',
  EDIT_INVOICE_SUCCESS: 'Invoice edit successfully',
  EDIT_INVOICE_FAILED: 'Failed to edit invoice',
  DELETE_INVOICE_SUCCESS: 'Invoice delete successfully',
  DELETE_INVOICE_FAILED: 'Failed to delete invoice',
  GET_INVOICE_SUCCESS: 'Invoice get successfully',
  GET_INVOICE_FAILED: 'Failed to get invoice',
  GET_ALL_INVOICE_SUCCESS: 'Invoice get all successfully',
  GET_ALL_INVOICE_FAILED: 'Failed to get all invoice',
  GET_DASHBOARD_INVOICE_SUCCESS: 'Dashboard invoice get successfully',
  GET_DASHBOARD_INVOICE_FAILED: 'Failed to get ashboard invoice ',
  // user
  CREATE_USER_SUCCESS: 'Staff created successfully',
  CREATE_USER_FAILED: 'Failed to create staff',
  GET_STAFF_SUCCESS: 'Staff get successfully',
  GET_STAFF_FAILED: 'Failed to get staff',
  EDIT_STAFF_SUCCESS: 'Staff edit successfully',

    //tax 
    CREATE_TAX_SUCCESS: 'Tax created successfully',
    CREATE_TAX_FAILED: 'Failed to create tax',
    GET_ALL_TAX_SUCCESS: 'Get tax list successfully',
    GET_ALL_TAX_FAILED: 'Failed to get all tax list',
    EDIT_TAX_SUCCESS: 'Edit tax  successfully',
    EDIT_TAX_FAILED: 'Failed to edit tax',
    DELETE_TAX_SUCCESS: 'Delete tax  successfully',
    DELETE_TAX_FAILED: 'Failed to delete tax',
    TAX_GET_SUCCESS: 'Get tax  successfully',
    TAX_GET_FAILED: 'Failed to get tax',
  // Campaign

  CREATE_CAMPAIGN_SUCCESS: 'Campaign created successfully',
  CREATE_CAMPAIGN_FAILED: 'Failed to create Campaign',
  GET_CAMPAIGN_SUCCESS: 'Campaign get successfully',
  GET_CAMPAIGN_FAILED: 'Failed to get Campaign',
  EDIT_CAMPAIGN_SUCCESS: 'Campaign edit successfully',
  EDIT_CAMPAIGN_FAILED: 'Familed to edit Campaign',
  GET_ALL_CAMPAIGN_SUCCESS: 'Campaign get all successfully',
  GET_ALL__CAMPAIGN_FAILED: 'Failed to get all Campaign',

  // Client Bulk Upload 
  CREATE_CLIENT_BULK_UPLOAD_SUCCESS: 'Create bulk upload client successfully',
  CREATE_CLIENT_BULK_UPLOAD_FAILED: 'Failed to upload clients',

  // Campaign

  CREATE_DRAFT_SUCCESS: 'Draft created successfully',
  CREATE_DRAFT_FAILED: 'Failed to create draft',
  GET_DRAFT_SUCCESS: 'Draft get successfully',
  GET_DRAFT_FAILED: 'Failed to get draft',
  EDIT_DRAFT_SUCCESS: 'Draft edit successfully',
  EDIT_DRAFT_FAILED: 'Familed to edit draft',
  GET_ALL_DRAFT_SUCCESS: 'Draft get all successfully',
  GET_ALL_DRAFT_FAILED: 'Failed to get all draft',
  DELETE_DRAFT_SUCCESS: 'Delete draft  successfully',
  DELETE_DRAFT_FAILED: 'Failed to delete draft',

   // Expense

   CREATE_EXPENSE_SUCCESS: 'Expense created successfully',
   CREATE_EXPENSE_FAILED: 'Failed to create expense',
   EDIT_EXPENSE_SUCCESS: 'Expense edit successfully',
   EDIT_EXPENSE_FAILED: 'Failed to edit expense',
   DELETE_EXPENSE_SUCCESS: 'Expense delete successfully',
   DELETE_EXPENSE_FAILED: 'Failed to delete expense',
   GET_EXPENSE_SUCCESS: 'Expense get successfully',
   GET_EXPENSE_FAILED: 'Failed to get expense',
   GET_ALL_EXPENSE_SUCCESS: 'Expense get all successfully',
   GET_ALL_EXPENSE_FAILED: 'Failed to get all expense',
};

module.exports = { responseMessages };
