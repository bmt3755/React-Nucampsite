
import React, { Component } from "react";
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, 
        Button, Modal, ModalHeader, ModalBody} from 'reactstrap';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import Label from "reactstrap/lib/Label";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

class CampsiteInfo extends Component {

    constructor(props) { 
        super(props);
        
    };
    
    renderCampsite(campsite){
        return(
            <div className = "col-md-5 m-1">
                <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                        <CardBody>
                            <CardText>{campsite.description}</CardText>
                        </CardBody>
                </Card>
            </div>
        );
    }
    renderComments({comments, postComment, campsiteId}) {
        if(comments) {
            return (
                <div className = "col-md-5 m-1">
                    <h4 className="m-2">Comments</h4>
                    {comments.map(comment => 
                        <div key={comment.id} className="m-2">
                        {comment.text}<br/>
                        -- {comment.author}, 
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                        </div>
                    )}    
                    <CommentForm campsiteId={campsiteId} postComment={postComment} />                  
                </div>
                
            );
            
        }
    }
    render() {       
        function CampsiteInfo(props) {
            if (props.isLoading) {
                return (
                    <div className="container">
                        <div className="row">
                            <Loading />
                        </div>
                    </div>
                );
            }
            if (props.errMess) {
                return (
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4>{props.errMess}</h4>
                            </div>
                        </div>
                    </div>
                );
            }
        if(this.props.campsite) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{this.props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{this.props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        {this.renderCampsite(this.props.campsite)}
                        <this.renderComments 
                        comments={this.props.comments}
                        postComment={this.props.postComment}
                        campsiteId={this.props.campsite.id}
                        />
                        
                    </div>
                </div>
            );
        }
    }
    return <div></div>
}
}



const required = val => val && val.length;
const minLength = len => val => val && (val.length >= len);
const maxLength = len => val => !val || (val.length <= len);

class CommentForm extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        }
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render() {
        return(
            <React.Fragment>
                <Button outline onClick={this.toggleModal}>                
                    <i className="fa fa-pencil fa-lg" /> Submit Comment
                </Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                    <LocalForm onSubmit={values => this.handleSubmit(values)}>
                        <div className="form-group">
                            <Label htmlFor="rating">Rating</Label>
                            <Control.select model=".rating" id="rating" name="rating"
                                className="form-control">
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Control.select>
                        </div>
                        <div className="form-group">
                            <Label htmlFor="author">Your Name</Label>
                            <Control.text model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className="form-control"
                                        validators={{
                                            required,
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                            }}
                                        />
                                        <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Your name is incorrect',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="text">Comment</Label>
                            <Control.textarea model=".text" id="text" name="text"
                                        rows="6"
                                        className="form-control"/>
                        </div>
                        <Button type="submit" value="submit" color="primary">Submit</Button>
                    </LocalForm>
                    </ModalBody>
                </Modal> 

            </React.Fragment>
            

        );
    }
}
export default CampsiteInfo;