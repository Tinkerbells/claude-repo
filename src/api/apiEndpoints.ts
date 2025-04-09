// export const API_BASE_URL = `https://galim.pythonanywhere.com/all`;
// export const API_BASE_URL = `https://kao-dev-bi01:8110/OLAP/OLAP`;
// export const API_BASE_URL  = `http://localhost:5555/OLAP`;
export const API_BASE_URL = `http://192.168.1.125:5002/`
// export const API_BASE_URL = `https://pruv-fsdev-web1/olap`;

export const API_ENDPOINTS = {
  TABLE_FOR_TABLES: `${API_BASE_URL}/all/get_table_for_tables`,
  VERSIONS_FOR_TABLE: `${API_BASE_URL}/all/get_versions_for_table`,
  SPECIFIC_FILTERS: `${API_BASE_URL}/all/get_specific_filters`,
  GET_OLAP: `${API_BASE_URL}//olap/get_olap`,
  GENERATE_OLAP: `${API_BASE_URL}/olap/generate_olap`,
  SAVE_OLAP: `${API_BASE_URL}/olap/save_olap`,
}
