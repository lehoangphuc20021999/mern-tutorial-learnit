import React from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom'
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AlertMessage from '../layout/AlertMessage';

const RegisterForm = props => {

    // Context
    const {registerUser} = useContext(AuthContext)

    //Router
    // const history = useHistory()

    // Local state 
    const [registerForm, setRegisterForm] = useState({
        username: '',
        password: ''
    })

    const [alert, setAlert] = useState(null)
    const {username, password, confirmPassword} = registerForm

    //- Để gõ text và lấy giá trị
    const onChangeRegisterForm = e => setRegisterForm({
        ...registerForm, [e.target.name]: e.target.value
    })
    
    const register = async (e) =>{
        e.preventDefault()

        if(password !== confirmPassword){
            setAlert({type: 'danger', message: 'Password do not match'})
            setTimeout(() => setAlert(null), 5000)
            return
        }   

        try {
            const registerData = await registerUser(registerForm)

            if(!registerData.success){
                setAlert({type: 'danger', message: registerData.message})
                setTimeout(() => setAlert(null), 5000)
            }
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <>
            <Form className="my-4" onSubmit={register}>
                <AlertMessage info={alert} />
                <Form.Group className="mb-3"> 
                    <Form.Control type="text" placeholder="Username" name="username" required value={username} onChange={onChangeRegisterForm}/> 
                </Form.Group>
                <Form.Group className="mb-3"> 
                    <Form.Control type="password" placeholder="Password" name="password" required value={password} onChange={onChangeRegisterForm}/> 
                </Form.Group>
                <Form.Group className="mb-3"> 
                    <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" required value={confirmPassword} onChange={onChangeRegisterForm}/> 
                </Form.Group>
                <Button variant="success" type="submit">Register</Button>
            </Form>
            <p>
                Already have an account ?
                <Link to="/login">
                    <Button variant ="info" size='sm' className="ml-2"> Login </Button>
                </Link>
            </p>
        </>
    )
};

export default RegisterForm;