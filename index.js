const saveBtn = document.getElementById("input-btn");
const deleteAllBtn = document.getElementById("delete-btn");
const saveTabBtn = document.getElementById("save-tab-btn");
const inputEl = document.getElementById("input-el");
const unorderedList = document.getElementById("unorder-list");
let myLeads = [];
let leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))

if(leadsFromLocalStorage){
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

//create an prompt if there is a input save that with the 
function nameTheLink(){
  const nameOfLink=  prompt("what to name the link");

 if(nameOfLink){
  return nameOfLink;
 }
 else{
  return;
 }
}

function render(leads) {  
  let listItem = "";
 leads.forEach(element => {
    listItem += `<li>
    <a href = '${element.link}' target='_blank' >${element.nameForLink||element.link}</a>
    <button class="deleteSingleTab">X</button>
    </li>
    `;
 });
  unorderedList.innerHTML = listItem;
}

function saveLink(){
  const nameForLink = nameTheLink();
  const newEntry=nameForLink?{nameForLink,link:inputEl.value}:{link:inputEl.value}
  
   if (newEntry) {
    myLeads.push(newEntry);
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    render(myLeads);
  }
  inputEl.value = "";
}

//SAVE PASTED LINK
saveBtn.addEventListener("click", saveLink);
document.addEventListener("keydown",(event)=>{
  if(event.key==="Enter" && inputEl.value!="" ){
    saveLink();
  }
})

//DELETE
deleteAllBtn.addEventListener("dblclick",()=>{
  localStorage.clear();
  myLeads=[];
  render(myLeads);
})

//SAVE TABS
saveTabBtn.addEventListener("click",()=>{
chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  const tabURL = tabs[0].url;
  const  nameForLink= nameTheLink()
  const newEntry = nameForLink?{nameForLink,link:tabURL}:{link:tabURL}
    myLeads.push(newEntry)
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    render(myLeads)
})
  
})
//delete single link
unorderedList.addEventListener("dblclick", (event) => {
  if (event.target.classList.contains("deleteSingleTab")) {
    const listItem = event.target.parentNode; // Get the <li>
    

    const linkToDelete = listItem.querySelector("a").getAttribute("href"); // Get the URL from the <a> tag
    
    // Remove the <li> from the DOM
    listItem.remove();
  
    // Update myLeads and localStorage
    myLeads = myLeads.filter((lead) => lead["link"] !== linkToDelete); // Remove the lead from the array
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads)
  }
});