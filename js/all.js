let data;

let xhr = new XMLHttpRequest();
xhr.open("get", "https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c", true);
xhr.send(null);

xhr.onload = function () {
    if (xhr.status == "200") {
        let str = JSON.parse(xhr.responseText);
        data = str.data.XML_Head.Infos.Info;
        //資料載入完成，開啟頁面
        let wrap = document.querySelector(".wrap");
        wrap.style = "display:block;";
        //關閉loading提示
        let loading = document.querySelector(".loading");
        // loading.style = "display:none;";
        serachCountyData();
        setCounty();
    }
    else {
        console.log("資料錯誤!!");
    }
}

function setCounty() {
    let data_county = [];
    //篩選區域
    for (let i = 0; i < data.length; i++) {
        let index = data[i].Add.indexOf("區");
        let str = data[i].Add.substring(6, index+1);
        if (data_county.indexOf(str) == -1) {
            data_county.push(str);
            // console.log(str);
        }
    }

    //動態產生選項
    let county_select = document.querySelector(".countySelect");
    for (let i = 0; i < data_county.length; i++) {
        let opt = document.createElement("option");
        opt.value = data_county[i];
        opt.textContent = data_county[i];
        county_select.appendChild(opt);
    }
}

let hotListData = [
    {
        color: "purple",
        county: "苓雅區"
    },
    {
        color: "orange",
        county: "三民區"
    },
    {
        color: "yellow",
        county: "新興區"
    },
    {
        color: "blue",
        county: "鹽埕區"
    }
]

//顯示清單物件
let list = document.querySelector(".list");
//select物件
let select = document.querySelector(".countySelect");
//搜尋區域的title
let countyTitle = document.querySelector(".countyTitle");
//熱門清單
let hotList = document.querySelector(".hotList");
//gotop Button
let topBtn = document.querySelector(".topBtn");
//預設區域
let searchCounty = "三民區";
//搜尋目標data欄位
let searchData = [];
//頁數清單ul
let pageList = document.querySelector(".pageList");
//目前頁數 預設1
let page = 1;
//宣告總頁數
let totalPage;

function serachCountyData() {
    //重設搜尋出來的資料
    searchData = [];
    //重設頁數
    page = 1;
    //將顯示文字改為搜尋的區域
    countyTitle.textContent = searchCounty;
    //產生搜尋出來的資訊，更新searchData
    for (let i = 0; i < data.length; i++) {
        let str = data[i].Add;
        let temp = {};
        if (str.indexOf(searchCounty) > -1) {
            temp.name = data[i].Name;
            temp.address = data[i].Add;
            temp.openHour = data[i].Opentime;
            temp.tel = data[i].Tel;
            temp.ticket = data[i].Ticketinfo;
            temp.pic = data[i].Picture1;
            searchData.push(temp);
        }
    }
    //更新資訊欄
    updataList();
    //確認頁數
    checkPageNum();
}

//更新下方資訊欄
function updataList() {
    let str = "";
    for (let i = (page - 1) * 10; i < (page) * 10; i++) {
        if (searchData[i] == null) break;
        str += `<li>
                    <div class="img">
                    <img src=${searchData[i].pic} width="464px" height="273px" alt="photo">
                        <h3>${searchData[i].name}</h3>
                        <h4>${searchCounty}</h4>
                    </div>
                    <div class="info">
                        <div class="openHour">${searchData[i].openHour}</div>
                        <div class="address">${searchData[i].address}</div>
                        <div class="tel">${searchData[i].tel}</div>
                        <div class="ticket">${searchData[i].ticket}</div>
                    </div>
                </li>`
    }
    list.innerHTML = str;
    setTimeout(() => { updataPageList(); }, 100);
}

//熱門行政區加入功能
function createHotList() {
    //生成按鈕並加上功能(createElement)
    for (let i = 0; i < hotListData.length; i++) {
        //創造li物件
        let str = document.createElement("li");
        //設定class與內容
        str.setAttribute("class", hotListData[i].color);
        str.textContent = hotListData[i].county;
        //加入至ul中
        hotList.appendChild(str);
        //加上click功能
        str.addEventListener("click", () => {
            
            searchCounty = str.textContent;
            //設定select選項
            let county_select = document.querySelector(".countySelect");
            county_select.value = searchCounty;
            serachCountyData();
        })
    }
}
createHotList();

//判斷頁數
function checkPageNum() {
    totalPage = Math.floor(searchData.length / 10);
    if (searchData.length % 10 > 0) totalPage++;
    if (totalPage > 1) {
        createPageList();
    } else {
        pageList.innerHTML = "";
    };
}

//生成頁數清單
function createPageList() {
    //清空pageList內容
    pageList.innerHTML = "";
    //增加prev按鈕
    let prev = document.createElement('a');
    prev.setAttribute("class", "btnDisable")
    // prev.setAttribute("href", "javascript: void(0)");
    prev.setAttribute("id", "prev");
    prev.textContent = "< prev";
    pageList.appendChild(prev);
    prev.addEventListener("click", function () {
        let num = parseInt(page) - 1;
        if (num < 1) return;
        page--;
        updataList();
    })
    //增加中間頁數按鈕
    for (let i = 0; i < totalPage; i++) {
        let temp = document.createElement('a');
        temp.textContent = i + 1;
        temp.setAttribute("href", "#");
        temp.setAttribute("class", "page")
        if (i == 0) { temp.setAttribute("class", "pageCurrent") };
        pageList.appendChild(temp);
        temp.addEventListener("click", function () {
            page = temp.textContent;
            updataList();
        })
    }
    //增加next按鈕
    let next = document.createElement('a');
    next.setAttribute("href", "#");
    next.setAttribute("id", "next");
    next.textContent = "next >";
    pageList.appendChild(next);
    next.addEventListener("click", function () {
        let num = parseInt(page) + 1;
        if (num > totalPage) return;
        page++;
        updataList();
    })
}

//update 頁數列表功能
function updataPageList() {
    if (pageList.innerHTML == "") return
    let prev = document.querySelector("#prev");
    let next = document.querySelector("#next");

    let el = document.querySelectorAll(".pageList a");
    for (let i = 0; i < totalPage; i++) {
        el[i + 1].setAttribute("class", "");
    }
    el[page].setAttribute("class", "pageCurrent");

    if (page == 1) {
        prev.setAttribute("class", "btnDisable");
        prev.setAttribute("href", "javascript: void(0)");
        next.setAttribute("class", "");
        next.setAttribute("href", "#");
    } else if (page == totalPage) {
        prev.setAttribute("class", "");
        prev.setAttribute("href", "#");
        next.setAttribute("class", "btnDisable");
        next.setAttribute("href", "javascript: void(0)");
    } else {
        prev.setAttribute("class", "");
        prev.setAttribute("href", "#");
        next.setAttribute("class", "");
        next.setAttribute("href", "#");
    }
}

//監聽選項欄位變化的功能
select.addEventListener("change", () => {
    searchCounty = select.value;
    serachCountyData();
});
