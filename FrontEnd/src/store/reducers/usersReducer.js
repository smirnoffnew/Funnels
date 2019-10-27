const initialState = {
  // usersList: [
  //   {
  //     id: '1',
  //     firstName: 'Vladyslav',
  //     lastName: 'Huntyk',
  //     rules: 'View,Edit,Create',
  //   },
  //   {
  //     id: '2',
  //     firstName: 'Nataliya',
  //     lastName: 'Nerubenko',
  //     rules: 'View,Edit'
  //   },
  // ],

  // ownersList: [
  //   {
  //     id: '1',
  //     name: 'customer',
  //     rules: 'View',
  //     token: '"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlIjp7InBhc3N3b3JkIjoiJDJiJDEwJDRyRUMvc0RUNElCc0FQYnJRbDdyZU8yL0xabGJILnVLcFNkS2hyVkVVOVdKU2xvSE5pb0JLIiwiZW1haWwiOiJ2bGFkeXNsYXYuaHVudHlrQHJvY2tldGVtYWlscy5jb20iLCJmaXJzdE5hbWUiOiJWbGFkeXNsYXYiLCJhY2NvdW50TmFtZSI6IlJvY2tldGVtYWlscyIsImRlc2NyaXB0aW9uIjp7ImRlc2NyaXB0aW9uIjoiQWdlbmN5In0sInBob3RvVXJsIjoiL3B1YmxpYy9hdmF0YXJzL1ZsYWQucG5nIiwibGltaXRlZCI6ZmFsc2UsIl9pZCI6IjVkM2ViZWIyMzMyZjkwMDAyN2JmYzg3MCIsIm15Q29sbGFib3JhdGlvbnMiOltdfSwidXNlcklkIjoiNWQzZWJlYjIzMzJmOTAwMDI3YmZjODZlIiwiaWF0IjoxNTcxNDg4MjI1LCJleHAiOjE1NzE3NDc0MjV9.bZZa-mzYJIJw3k4cxW6HaE0xS6Q76cVht-HxRS8VZ7c"'
  //   },
  //   {
  //     id: '2',
  //     name: 'TRIOLUX',
  //     rules: 'View',
  //     token: 'token2'
  //   }
  // ],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'GENERATION_LINK_TO_ADD_USER_MESSAGE':
      return {
        ...state,
        messageLinkToAddUser: action.payload,
      }
    case 'GENERATION_LINK_TO_ADD_USER_MESSAGE_RESET':
      return {
        ...state,
        messageLinkToAddUser: null
      }
    case 'GENERATED_LINK_TO_ADD_USER':
      return {
        ...state,
        linkToAddUser: action.payload,
      }
    case 'GENERATED_LINK_TO_ADD_USER_RESET':
      return {
        ...state,
        linkToAddUser: null,
      }

    ///////////////////////////////////////////////////////////

    case 'RESET_ALL_USERS':
      return {
        ...state,
        usersList: null
      };
    case 'GET_ALL_USERS':
      return {
        ...state,
        usersList: action.payload
      };
    case 'GET_ALL_USERS_MESSAGE_ERROR':
      return {
        ...state,
        messageErrorGetAllUsers: action.payload,
      }
    case 'GET_ALL_USERS_MESSAGE_ERROR_RESET':
      return {
        ...state,
        messageErrorGetAllUsers: null
      }

    ///////////////////////////////////////////////////////////


    // case 'RESET_ALL_OWNERS':
    //   return {
    //     ...state,
    //     ownersList: null
    //   };
    // case 'GET_ALL_OWNERS':
    //   return {
    //     ...state,
    //     ownersList: action.payload
    //   };
    case 'GET_ALL_OWNERS_MESSAGE_ERROR':
      return {
        ...state,
        messageErrorGetAllOwners: action.payload,
      }
    case 'GET_ALL_OWNERS_MESSAGE_ERROR_RESET':
      return {
        ...state,
        messageErrorGetAllOwners: null
      }

    /////////////////////////////////////////////////////////// 

    case 'CHANGE_PERMISSION_FOR_USER_MESSAGE':
      return {
        ...state,
        messageChangePermissionForUser: action.payload,
      }
    case 'CHANGE_PERMISSION_FOR_USER_MESSAGE_RESET':
      return {
        ...state,
        messageChangePermissionForUser: null
      }

    ///////////////////////////////////////////////////////////

    case 'DELETE_USER':
      const list = state.usersList.filter(user => user._id !== action.payload);
      return {
        ...state,
        usersList: list,
      };
    case 'DELETE_USER_MESSAGE_ERROR':
      return {
        ...state,
        messageErrorDeleteUser: action.payload,
      }
    case 'DELETE_USER_MESSAGE_ERROR_RESET':
      return {
        ...state,
        messageErrorDeleteUser: null
      }



    default: return state;
  }
}
