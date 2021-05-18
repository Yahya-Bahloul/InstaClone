import React, { Component, TouchableOpacity } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import { baseURL } from "../../constants";

import {
  Card,
  CardItem,
  Thumbnail,
  Body,
  Left,
  Right,
  Button,
  Icon,
} from "native-base";
import axios from "axios";

class PostComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userpicurl:
        "https://i.pinimg.com/280x280_RS/b8/49/79/b849797ed8b78c6d2d8ab6db464d61fe.jpg",
    };
  }
  EditPost(urlpost, description, userid, Id, navigation, editpost) {
    const postdata = {
      urlpost: urlpost,
      description: description,
      userid: userid,
      Id: Id,
    };

    editpost(postdata);
    navigation.navigate("EditPost");
  }
  check = () => {
   
    if (this.props.userpicurl) {
      this.setState({ userpicurl: this.props.userpicurl });
    }
  };
  componentDidMount() {
   
    this.check();
  }
  render() {
    return (
      <Card>
        <CardItem>
          <Left>
            <Thumbnail
              source={{
                uri: this.props.userpicurl,
              }}
            />

            <Body>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 15,
                  color: "#001219",
                }}
              >
                {this.props.username}
              </Text>
              <Text note> Mai 10, 2021</Text>
            </Body>
          </Left>
          <Right>
            
              <Icon
              onPress={() =>
                this.EditPost(
                  this.props.imageSource,
                  this.props.caption,
                  this.props.userid,
                  this.props.Id,
                  this.props.navigation,
                  this.props.editpost
                )
              }
              
              name="ios-pencil" style={{ color: "#001219"}} />

          </Right>
        </CardItem>
        <CardItem cardBody>
          <Image
            source={{ uri: this.props.imageSource }}
            style={{ height: 200, width: 100, flex: 1 }}
          />
        </CardItem>
        <CardItem style={{ height: 45 }}>
          <Left>
              <Icon
               onPress={() =>{
                axios({
                  method: "post",
                  url: "/like",
                  baseURL: baseURL,
                  data: {
                    Id: this.props.Id,
  
                  },
                })
                .then((res) => {
                  const message = res.data.message;
          
                  if (res.data.value) {
                    console.log(message)
                  }
                })
                .catch((err) => console.log(err));
              }

              } 
              name="ios-heart-outline" style={{ color: "black" }} />
               
                
           
            <Button transparent>
              <Icon name="ios-chatbubbles-outline" style={{ color: "black" }} />
            </Button>
            <Button transparent>
              <Icon name="ios-send-outline" style={{ color: "black" }} />
            </Button>
          </Left>
        </CardItem>

        <CardItem style={{ height: 20 }}>
          <Text>{this.props.likes} </Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 17,
                  color: "#2a9d8f",
                }}
              >
                {this.props.username}
              </Text>
            
              {this.props.caption}
            </Text>
          </Body>
        </CardItem>
      </Card>
    );
  }
}
export default PostComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
