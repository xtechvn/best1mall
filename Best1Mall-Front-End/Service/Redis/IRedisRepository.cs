﻿namespace Best1Mall_Front_End.Service.Redis
{
    public interface IRedisRepository
    {
        public void Set(string key, string value);
        public void Remove(string key);
        public string Get(string key);
    }
}
