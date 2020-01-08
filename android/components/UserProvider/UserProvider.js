import React from 'react'

const UserContext = React.createContext();

class UserProvider extends React.Component{
    state ={
        user:null,
        loggedIn: false,
    }

    setUser = (user) =>{
        this.setState({user});
    }

    setLoggedIn = (loggedIn) =>{
        this.setState({loggedIn});
    }

    render() {
        return (
            <UserContext.Provider value={{
                user:this.state.user,
                loggedIn: this.state.loggedIn,
                setUser: this.setUser,
                setLoggedIn: this.setLoggedIn
            }}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
}

export {UserProvider, UserContext};