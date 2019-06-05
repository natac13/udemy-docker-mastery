const rsconf = {
  _id: "docker-test",
  members: [
    { _id: 0, host: "db_db1:27017" },
    { _id: 1, host: "db_db2:27017" },
    { _id: 2, host: "db_db3:27017" }
  ]
};

rs.initiate(rsconf);

rs.conf();
