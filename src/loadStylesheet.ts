export const loadStylesheet = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
  .pri-table__inner{
    width: 100% !important;
  }
  
  .reports-availability-table .pri-table-header tr th:nth-child(3), .reports-availability-table tr td.pri-table-cell:nth-child(3){
    display: none;
  }  
  
  .reports-availability-table td {
    overflow: hidden;
    position: relative;
  }
    
  [data-header-name="Avail"] {
    width: 10%;
  }
  
  [data-header-name="Notes"] {
    width: 45%;
  }
  
  [data-header-name="Edit"] {
    width: 5%;
  }
  
  [data-element-name="InitialLoader"] {
  background: rgba(0,0,0,.2);
  }
  
  [data-element-name="ToggleOnlyBench"] {
    display: flex;
    padding: 0 10px;
    margin: 0 24px 0 0;
    border: 1px solid rgba(255, 255, 255, 0.3);
    gap: 10px;
  }
  
  [data-element-name="ToggleOnlyBench"] .toggleElement-label {
    display: flex;
    margin-bottom: 0;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
  
 [data-element-name="ToggleOnlyBench"] .toggleElement-input {
     display: none;
 }
 
 [data-element-name="ToggleOnlyBench"] .checkmark {
    position: relative;
    height: 15px;
    width: 15px;
    background-color: #eee;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all .4s ease;
  }
  
  [data-element-name="ToggleOnlyBench"]:hover input ~ .checkmark, 
  [data-element-name="ToggleOnlyBench"]:hover input:checked ~ .checkmark {
    opacity: 0.8;
  }
  
  [data-element-name="ToggleOnlyBench"] input:checked ~ .checkmark {
    background-color: #13b6ca;
  }
  
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  
  [data-element-name="ToggleOnlyBench"] input:checked ~ .checkmark:after {
    display: block;
  }
  
  [data-element-name="ToggleOnlyBench"] .checkmark:after {
    left: 4px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  
  [data-header-name="Avail"], [data-header-name="Notes"],  [data-header-name="Edit"] {
    font-size: 12px;
    line-height: 14px;
    font-weight: 400;
    color: #FFFFFF99;
  }
  
   tbody tr td { 
     padding: 5px;
   }
  
  .reports-availability-table td textarea {
  background: transparent; 
  color: inherit; 
  width: 100%;
  height: 200px;
  padding: 10px 10px;
  box-sizing: border-box;
  resize: none;
  }
  
  .reports-availability-table td textarea::-webkit-scrollbar {
    width: 1px;
  }
  
  .developers-to-hidden {
    display: none;
  }
  `;
  document.head.appendChild(styleElement);
};
