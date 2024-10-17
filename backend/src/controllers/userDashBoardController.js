
const populateDashboard = async (req, res) => {
try {
  console.log(req.body);
}
 catch (error) {
    console.error(`Error logging in user: ${req.body.email}`, error);
    if (error.name === ""){
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    } else {
      res
        .status(500)
        .json({ message: "Error: ", error: error.message });
    }
  }
}


const dashBoardControllerFuncs = {
  populateDashboard,
}
export default dashBoardControllerFuncs;

