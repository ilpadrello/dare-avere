declare namespace DA {
  export interface Config {
    databases: {
      da: Knex.Config;
    };
  }
}
