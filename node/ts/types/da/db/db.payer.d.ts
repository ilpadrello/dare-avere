/**
 * Database representation of the payer
 */
declare namespace DA.DB {
  export interface Payer extends DA.Payer {
    id: DA.Payer.id;
    name: DA.Payer.name;
    created_at: DA.Payer.created_at;
  }
}
