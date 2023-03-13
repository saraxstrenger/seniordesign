import { ddbDocClient } from "./ddbDocClient.js";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const USER_TABLE = "User_Table";
const COURSE_TABLE = "Course_Table";
const EVAL_TABLE = "Evaluation_Table";

export async function createUser({
  username,
  password,
  first,
  last,
  email,
  entranceYear,
  major,
}) {
  // Set the parameters.
  const params = {
    TableName: USER_TABLE,
    Item: {
      username,
      password,
      first,
      last,
      email,
      entranceYear,
      major,
    },
    ConditionalOperator: "attribute_not_exists",
  };

  console.log(params);
//   return;

  try {
    const result = await ddbDocClient.send(new PutCommand());

    console.log("Success - user created", data);
    return true;
  } catch (err) {
    console.log("Error", err.stack);
    //TODO: handle error
    return false;
  }

  return true;
}
