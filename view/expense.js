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
    const response = await axios.post("http://54.157.219.108:3000/expense/Addexpense", expenseDetails, {
      headers: { Authorization: token },
    });
    console.log(response.headers);
    console.log("Expense data sent to the server:", response.data.expenses);
    adddnewExpensetoui(response.data.expenses);
  } catch (err) {
    console.log(" the error is ", err);
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
window.addEventListener("DOMContentLoaded", async function getExpense(page) {
  const token = localStorage.getItem("token");
  const decodetoken = parseJwt(token);
  console.log(decodetoken);
  const isadmin = decodetoken.ispremiumuser;
  pageSize();
  if (isadmin) {
    showpremiumonscreen();
    showonleaderboard();
  }

  try {
    const response = await axios.get(
      "http://54.157.219.108:3000/expense/GetExpense",
      //"http://54.157.219.108:3000/expense/GetExpense",
      {
        headers: { " Authorization": token },
      }
    );
   
    console.log("CHECKING RESPONSE", response);
    const data = response.data;
    console.log("data printing : ", data);
    data.allExpense.forEach((expense) => {
      adddnewExpensetoui(expense);
    });
    showPagination(response.data);
  } catch (err) {
    console.log("Error Loading Expenses : ", err.message);
  }
});

async function pageSize() {
  try {
    const token = localStorage.getItem("token");
    const pageSize=document.getElementById("NumberofRecords").value;
    localStorage.setItem("pageSize",document.getElementById("NumberofRecords").value); 
    const page = 1;
    const response = await axios.get(
      `http://54.157.219.108:3000/expense/GetExpense?page=${page}&pageSize=${pageSize}`,
      //`http:// 54.157.219.108:3000/expense/GetExpense?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: token } }
    );
    console.log("RESPONSE FROM PAGINATION", response.data);
    showPagination(response.data);
  } catch (err) {
    console.log("ERROR while pagination", err.message);
  }
}
function adddnewExpensetoui(expense) {
  const expenselist = document.getElementById("expenses");
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
        `http://54.157.219.108:3000/expense/deleteExpense/${expense.id}`,
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
      "http://54.157.219.108:3000/purchase/premiumMembership",
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
          "http://54.157.219.108:3000/purchase/updatetransectionstatus",
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
        "http://54.157.219.108:3000/purchase/updatetransectionstatus",
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
  document.getElementById("razorpay").style.visibility = "hidden";
  document.getElementById("message1").innerHTML = "You are a premium user";
  const leaderButton = document.createElement("button");
  leaderButton.innerHTML = "Show Leaderboard";
  leaderButton.onclick = async () => {
    let token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://54.157.219.108:3000/premium/showLeaderboard",
        //"http://54.157.219.108:3000/premium/showLeaderboard",
        {
          headers: { Authorization: token },
        }
      );

      const leaderboardData = response.data;
      console.log("LEADERBOARD DATA : ", leaderboardData);

      document.getElementById("message").innerHTML = "";
      leaderboardData.forEach((item) => {
        const li = document.createElement("li");
        li.className = "listLeaders";
        li.textContent = `Name: ${item.name} - Total Expense : ${item.totalexpense}`;
        document.getElementById("message").appendChild(li);
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  const downloadReportBtn = document.createElement("button");
  downloadReportBtn.innerHTML = "Download Report";
  downloadReportBtn.onclick = async function () {
    downloadReport();
  };
  const premiumFeaturesSection = document.getElementById("premium-features");
  premiumFeaturesSection.innerHTML = "";
  premiumFeaturesSection.appendChild(leaderButton);
  premiumFeaturesSection.appendChild(downloadReportBtn);
}
async function downloadReport() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://54.157.219.108:3000/expense/downloadreport",
      //"http://54.157.219.108:3000/expense/downloadreport"
      {
        headers: { Authorization: token },
      }
    );
    if (response.status === 200) {
      const fileUrl = response.data.fileURL;
      console.log("FILEURL: ", fileUrl);
      const a = document.createElement("a");
      a.href = response.data.fileURL;
      a.download = `Expense.txt`;
      a.click();
    } else {
      console.log("Errorr in downloading");
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
}
//
function showPagination({
  currentPage,
  previousPage,
  nextPage,
  hasnextPage,
  hasPreviousPage,
  lastPage,
}) {
  try {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    if (hasPreviousPage) {
      const prevBtn = document.createElement("button");
      prevBtn.innerHTML = `<a class="page-link">Previous</a>`;
      prevBtn.addEventListener("click", async () => {
        await getProducts(previousPage);
      });
      pagination.appendChild(prevBtn);
      pagination.append(" ");
    }

    //current page code
    
      const currBtn = document.createElement("button");
      currBtn.innerHTML = `<a class="page-link">currentpage</a>`;
      currBtn.addEventListener("click", async () => {
        await getProducts(currentPage);
      });
      pagination.appendChild(currBtn);

    //next page code
    if (hasnextPage) {

      const nextBtn = document.createElement("button");
      nextBtn.innerHTML = `<a class="page-link">Next</a>`;
      nextBtn.addEventListener("click", async () => {
        await getProducts(nextPage);
      });
      pagination.appendChild(nextBtn);
    }
    if(currentPage!==lastPage && lastPage!==nextPage){
      const lastBtn = document.createElement("button");
      lastBtn.innerHTML = `<a class="page-link">currentpage</a>`;
      lastBtn.addEventListener("click", async () => {
        await getProducts(currentPage);
      });
      pagination.appendChild(lastBtn);

     
  }
  } catch (err) {
    console.log(err);
  }
}

async function getProducts(page) {
  try {
    const token = localStorage.getItem("token");
    const pageSize = localStorage.getItem("pageSize");
    console.log("localStorage.getItem");
    const response = await axios.get(
      `http://54.157.219.108:3000/expense/getExpense?page=${page}&pageSize=${pageSize}`,
     //`http://54.157.219.108:3000/expense/getExpense?page=${page}&pageSize=${pageSize}`,
      {
        headers: { Authorization: token },
      }
    );

    const expenses = response.data.allExpense;
    console.log("PRINTING EXPENSES IN GETEXPENSESBYPAGE FUN",response.data );
    const expensesList = document.getElementById("expenses");
    expensesList.innerHTML = "";
    expenses.forEach((expense) => {
      adddnewExpensetoui(expense);
    });
    showPagination(response.data);
  } catch (err) {
    console.log(err.message);
  }
}
