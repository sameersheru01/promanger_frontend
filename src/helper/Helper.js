import {jwtDecode} from 'jwt-decode';

function addtokentoheader({headers}){
    
    const token = localStorage.getItem('token');
    if(token){
        headers.Authorization=`${token}`;
    }
    return headers;
}


const getCurrentUserId = () => {
  const token = localStorage.getItem('token'); 
  if (token) {
      const decodedToken = jwtDecode(token); 
      return decodedToken.user.email; 
  }
  return null; 
};


const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; 
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  function formatDate() {
    const date = new Date()
    const day = date.getDate();
    const dayWithSuffix = day + getOrdinalSuffix(day);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];
    return `${dayWithSuffix} ${monthNames[monthIndex]}, ${year}`;
  }
  function cardDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();
    const dayWithSuffix = day + getOrdinalSuffix(day);

    const monthIndex = date.getMonth();
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];

    return `${monthNames[monthIndex]} ${dayWithSuffix}`;
}
  function getFormattedDateTime() {
    const now = new Date();
    const date = formatDate();
    return {date};
  }
  function GetInitials(name){
    const trimmedname = name.trim().toUpperCase();
    const initials = trimmedname.slice(0,2);
  return initials;
}

const filterTodos = (todos, filterType) => {
  const currentDate = new Date(); 
  let filterStartDate;

  switch (filterType) {
    case 'Today':
      filterStartDate = new Date(currentDate.setHours(0, 0, 0, 0)); 
      return todos.filter(todo => new Date(todo.createdAt) >= filterStartDate);
      
    case 'This Week':
      filterStartDate = new Date(currentDate);
      filterStartDate.setDate(currentDate.getDate() - 6); 
      return todos.filter(todo => {
        const createdAt = new Date(todo.createdAt);
        return createdAt >= filterStartDate && createdAt <= currentDate; 
      });
      
    case 'This Month':
      filterStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); 
      return todos.filter(todo => new Date(todo.createdAt) >= filterStartDate);
      
    default:
      return todos; 
  }
};
function isDuePassed(dateString) {
  const dueDate = new Date(dateString);
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);

  return dueDate < today;
}


export {addtokentoheader,GetInitials,formatDate,getFormattedDateTime,cardDate,filterTodos,getCurrentUserId,isDuePassed};