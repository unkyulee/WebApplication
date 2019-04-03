using System.Collections.Generic;

namespace Web.Appliction.Lib
{
    public static class DictionarySafe
    {
        public static object Get<TKey, TValue> (this IDictionary<TKey, TValue> dictionary, TKey key)
        {
            if (dictionary == null)
                return null;

            TValue value;
            dictionary.TryGetValue(key, out value);
            return value;
        }

        // make sure the return value is array
        public static object GetArray<TKey, TValue>(this IDictionary<TKey, TValue> dictionary, TKey key)
        {
            TValue value;
            dictionary.TryGetValue(key, out value);
            if (value == null) return new object[0];
            if (value.GetType().IsArray == false) return new object[] { value };
            return value;
        }     

    }
}
