import knex from "../../utils/knex";
import { v4 as uuidv4 } from "uuid";

class PayerManager {
  private _payers: Array<DA.DB.Payer> = [];
  constructor() {}

  public async load() {
    this._payers = await knex("payers").whereNull("deleted_at").select();
  }

  public async get() {
    await this.load();
    return this._payers;
  }

  public async getByName(name: string) {
    this.load;
    return this._payers.find((payer) => payer.name === name);
  }

  public async findById(id: string) {
    const payer = (await knex("payers")
      .where("id", id)
      .select()
      .first()) as DA.DB.Payer;
    if (payer) {
      return payer;
    }
    return;
  }

  public async add(payer: DA.Payer) {
    //Check for name
    if (!payer.name) {
      throw new Error("A payer must have a least a name");
    }
    //Check for max payers number
    const [count] = await knex("payers")
      .count("id as number")
      .where({ deleted_at: null });

    if (count.number >= 2) {
      throw new Error("Max 2 payers per project");
    }

    if (!payer.id) {
      payer.id = uuidv4();
      await knex("payers").insert(payer);
      await this.load();
    }
  }

  public async delete(payer_uuid: string) {
    if (!payer_uuid) {
      throw new Error("No uuid given while trying to delete a payer");
    }
    await knex("payers")
      .where("id", payer_uuid)
      .update({ deleted_at: new Date() });
    await this.load();
  }

  public async changeName(payer: DA.Payer | DA.DB.Payer) {
    if (!payer.id || !payer.name) {
      throw new Error("To rename a payer you need at least a name and the ID");
    }
    await knex("payers").update("name", payer.name).where("id", payer.id);
  }
}

export default PayerManager;
