using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace Web.Application.Services.DB
{
    public class SQL
    {
        string connectionString;        
        
        public SQL(string connectionString)
        {
            this.connectionString = connectionString;  
        }

        public IList<IDictionary<string, object>> Query(
            string sql
            , IDictionary<string, object> parameters = null
            , string[] excludeFields = null
        )
        {
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                List<IDictionary<string, object>> result = new List<IDictionary<string, object>>();
                SqlCommand cmd = new SqlCommand(sql, conn);
                // Attach parameter
                if (parameters != null)
                    foreach (KeyValuePair<string, object> parameter in parameters)
                        cmd.Parameters.AddWithValue($"@{parameter.Key}", parameter.Value);

                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        IDictionary<string, object> row =
                            Enumerable.Range(0, reader.FieldCount)
                                .ToDictionary(reader.GetName, reader.GetValue);

                        // remove fields 
                        if (excludeFields != null)
                        {
                            foreach (string field in excludeFields)
                                row.Remove(field);
                        }

                        // add to the result
                        result.Add(row);
                    }
                }

                conn.Close();
                return result;
            }
        }

        public object Execute(
            string sql
            , IDictionary<string, object> parameters
            )
        {
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlCommand cmd = new SqlCommand(sql, conn);
                // Attach parameter
                if (parameters != null)
                    foreach (KeyValuePair<string, object> parameter in parameters)
                    {
                        if(parameter.Value != null && parameter.Value.GetType() == typeof(byte[]))
                        {
                            cmd.Parameters.Add($"@{parameter.Key}", SqlDbType.VarBinary, ((byte[])parameter.Value).Length).Value = parameter.Value;
                        }
                        else
                        {
                            cmd.Parameters.AddWithValue($"@{parameter.Key}", parameter.Value);
                        }                            
                    }
                        

                var result = cmd.ExecuteScalar();

                conn.Close();
                return result;
            }
        }
    }
}
