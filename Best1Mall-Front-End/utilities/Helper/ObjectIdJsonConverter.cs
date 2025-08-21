namespace Best1Mall_Front_End.Utilities.Helper
{
    using MongoDB.Bson;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using System;

    public class ObjectIdJsonConverter : JsonConverter<string>
    {
        public override string ReadJson(JsonReader reader, Type objectType, string existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            if (reader.TokenType == JsonToken.StartObject)
            {
                var jo = JObject.Load(reader);
                // Lấy $oid nếu có
                if (jo["$oid"] != null)
                    return jo["$oid"].ToString();

                // Nếu BE trả full object (timestamp, machine...) thì convert sang ObjectId string
                try
                {
                    var objectId = BsonObjectId.Create(jo.ToString());
                    return objectId.ToString();
                }
                catch
                {
                    return jo.ToString();
                }
            }
            return reader.Value?.ToString();
        }

        public override void WriteJson(JsonWriter writer, string value, JsonSerializer serializer)
        {
            writer.WriteValue(value);
        }
    }

}
