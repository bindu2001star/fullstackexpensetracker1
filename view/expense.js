//const { default: axios } = require("axios");

async function addnewExpense(e) {
  console.log("thomas the maze runner");
  e.preventDefault();
  const expenseDetails = {
    amount: e.target.amount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  const token = localStorage.getItem("token");
  console.log(expenseDetails);
  try {
    const response = await axios.post("/expense/Addexpense", expenseDetails, {
      headers: { Authorization: token },
    });
    console.log(response.headers);
    console.log("Expense data sent to the server:", response.data.expense);
    adddnewExpensetoui(response.data.expense);
  } catch (err) {
    console.log(" the error is ", error);
  }
}
function showpremiumonscreen() {
  document.getElementById("razorpay").style.visibility = "hidden";
  document.getElementById("message1").innerHTML = "You are a premium user";
}
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
window.addEventListener("DOMContentLoaded", async function getExpense() {
  const token = localStorage.getItem("token");
  const decodetoken = parseJwt(token);
  console.log(decodetoken);
  const isadmin = decodetoken.ispremiumuser;
  if (isadmin) {
    showpremiumonscreen();
    showonleaderboard();
  }
  // try {
  //     // { headers: { "Authorization": token } }
  //     const response = await axios.get('http://localhost:10000/expense/Getexpense',{ headers: { "Authorization": token } });
  //     console.log("checking response", response);
  //     const data = response.data;
  //     console.log(data);
  //     response.data.expenses.forEach(expense => {

  //         adddnewExpensetoui(expense);
  //     })
  // } catch (err) {
  //     console.log(err.message);
  // }
  try {
    const response = await axios.get(
      "http://localhost:10000/expense/getExpense",
      {
        headers: { " Authorization": token },
      }
    );
    console.log("CHECKING RESPONSE", response);
    const data = response.data;
    console.log("data printing : ", data);
    data.expenses.forEach((expense) => {
      adddnewExpensetoui(expense);
    });
  } catch (err) {
    console.log("Error Loading Expenses : ", err.message);
  }
});
function adddnewExpensetoui(expense) {
  const expenselist = document.getElementById("expense");
  const expenseId = `expense-${expense.id}`;
  const li = document.createElement("li");
  li.textContent = `Amount:${expense.amount}--description:${expense.description}--category:${expense.category}`;
  expenselist.appendChild(li);
  const deltbtn = document.createElement("input");
  deltbtn.type = "button";
  deltbtn.value = "Delete";
  deltbtn.onclick = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:10000/expense/deleteExpense/${expense.id}`,
        {
          headers: { " Authorization": token },
        }
      );
      location.reload();
      //console.log(response);
    } catch (err) {
      console.log(err.message);
    }
  };
  li.appendChild(deltbtn);
}
document.getElementById("razorpay").onclick = async function (e) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://localhost:10000/purchase/premiumMembership",
      {
        headers: { Authorization: token },
      }
    );
    console.log(response.data);
    var options = {
      " key": response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        const data1 = await axios.post(
          "http://localhost:10000/purchase/updatetransectionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        alert("Congratulations!!! You are a premium User Now");

        document.getElementById("razorpay").style.visibility = "hidden";
        document.getElementById("message1").innerHTML =
          "You are a premium user";
        console.log("data from purchasing token ", response);
        console.log("dataaaaaaa", data1);
        localStorage.setItem("token", data1.data.token);
        showonleaderboard();
        //console.log(token,'.>>>>>>')
      },
    };
    const razor = new Razorpay(options);
    razor.open();
    e.preventDefault();

    razor.on("payment.failed", async function (response) {
      await axios.post(
        "http://localhost:10000/purchase/updatetransectionstatus",
        {
          status: "failed",
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );
    });
  } catch (err) {
    console.log(err.message);
  }
};
function showonleaderboard() {
  const inputelement = document.createElement("input");
  inputelement.type = "button";
  inputelement.value = "show leaderboard";
  inputelement.onclick = async () => {
    const token = localStorage.getItem("token");
    const userleaderboardarray = await axios.get(
      "http://localhost:10000/premium/showLeaderboard",
      {
        headers: { Authorization: token },
      }
    );
    console.log(userleaderboardarray);
    var leaderboardelement = document.getElementById("leaderboard");
    leaderboardelement.innerHTML += `<h1>LEADERBOARD</h1>`;
    userleaderboardarray.data.forEach((userDetail) => {
      leaderboardelement.innerHTML += `Name:${userDetail.name}--Total:${userDetail.total_cost}    `;
      document.getElementById("message1").style.visibility='hidden';
    });
  };
  document.getElementById("message1").appendChild(inputelement);
}
