import React, { Component } from "react";
import axios from "axios";
import Main from '../template/Main';

const headerProps  = {
    icon: 'users',
    title: 'Users',
    subtitle: 'User Create, Read, Update, Delete'
}

const baseUrl = 'http://localhost:3001/users';

const initialState = {
    user: {name: '', email: ''},
    list: []
};


export default class UserCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data });
        });
    }

    clear(){
        this.setState({ user: initialState.user });
    }

    save() {
        const user = this.state.user;
        const method = user.id ? 'put' : 'post';
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl;

        axios[method](url, user)
                .then(resp => {
                    const list = this.getUpdateList(resp.data);
                    this.setState({user: initialState.user, list })
                });
    }

    getUpdateList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id);
        if(add) list.unshift(user);
        return list;
    }

    updateField(event) {
        const user = { ...this.state.user };
        user[event.target.name]  = event.target.value;
        this.setState({ user });
    }

    load(user) {
        this.setState({ user });
    }

    remove(user){
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdateList(user, false);
            this.setState({ list });
        });
    }

    renderTable(){
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                { this.renderRows() }
                </tbody>
            </table>
        );
    }

    renderRows(){
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"/>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash" />
                        </button>
                    </td>
                </tr>
            )
        });
    }


    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name"
                                   className="form-control"
                                   placeholder="Type your name..." value={this.state.user.name}
                                   onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label htmlFor="name">Email</label>
                            <input type="email" name="email" id="email"
                                   className="form-control"
                                   placeholder="Type your email..." value={this.state.user.email}
                                   onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" onClick={e => this.save()}>
                            <i className="fa fa-save" /> Save
                        </button>
                        <button className="btn btn-secundary ml-2" onClick={e => this.clear()}>
                            <i className="fa fa-times" />Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}

