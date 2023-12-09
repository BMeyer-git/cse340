const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get a specific classification name
 * ************************** */
async function getClassificationName(classification_id){
  try {
    const name = await pool.query(
      `SELECT classification_name FROM public.classification
      WHERE classification_id = $1`,
      [classification_id]
    )
    return name.rows[0].classification_name
  } catch (error) {
    console.error("getclassificationname error " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get vehicle details by inv_id
 * ************************** */
async function getDetailByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("getdetailsbyid error " + error)
  }
}

/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add new vehicle
* *************************** */
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id){
  let inv_img = '/images/vehicles/no-image.png'
  let inv_thumbnail = '/images/vehicles/no-image-tn.png'
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_img, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add new vehicle
* *************************** */
async function updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id){
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* *****************************
*   Remove a vehicle
* *************************** */
async function deleteInventoryItem(inv_id){
  try {
    const sql =
      "DELETE FROM inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [
      inv_id
    ])
    return data
  } catch (error) {
    console.error("Delete Inventory error: " + error)
  }
}

/* *****************************
*   Remove funds from a user
* *************************** */
async function setWalletBalance(account_id, amount){
  try {
    const sql =
    "UPDATE public.account SET account_wallet = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
    amount,
    account_id
  ])
    return data
  } catch (error) {
    console.error("wallet Balance error: " + error)
  }
}

/* *****************************
*   purchase a vehicle
* *************************** */
async function buyInventoryItem(inv_id, account){
  try {
    // Add vehicle to user's personal inventory, then delete from the main inventory
    vehicle = await getDetailByInvId(inv_id)
    if (vehicle.inv_price <= account.account_wallet)
    {
      // Remove funds
      await setWalletBalance(account.account_id, (account.account_wallet - vehicle.inv_price))
      // Remove vehicle from general inventory
      const sql =
      "DELETE FROM inventory WHERE inv_id = $1"
      const data = await pool.query(sql, [
      inv_id
    ])
      if (data)
      {
        newBalance = account.account_wallet - vehicle.inv_price;
        return newBalance
      }
      else
      {
        return data
      }
    }
    else
    {
      return null
    }

  } catch (error) {
    console.error("Purchase Inventory error: " + error)
  }
}

module.exports = {getClassifications, getClassificationName, getInventoryByClassificationId, getDetailByInvId, addClassification, addInventory, updateInventory, deleteInventoryItem, buyInventoryItem};