import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import pinkMouse from "../../../assets/smallpinkMouse.png";
import star from "../../../assets/star.png";
import cloud from "../../../assets/cloud.png";
import lstar from "../../../assets/lStar.png";
import bigStar from "../../../assets/bigStar.png";
import icon from "../../../assets/pinkLines.png";

const SectionWrapper = styled(Box)({
  backgroundColor:"#FFF8F8",
  position: "relative",
  width: "740px",
  height: "840px",
  border: "none",
  borderRadius: "65px",
  boxSizing: "border-box",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Lstar = styled(Box)({
  position: "absolute",
  top: "85px",
  left: "246px",

});

const Cloud = styled(Box)({
  position: "absolute",
  top: "91px",
  right: "61px",

});

const BigStar = styled(Box)({
  position: "absolute",
  bottom: "259.7px",
  right: "0px",


});

const Star = styled(Box)({
  position: "absolute",
  top: "55px",
  left: "189px",

});

const Icon = styled(Box)({
  position: "absolute",
  bottom: "179.4px",
  left: "0px",

});

const ImageBox = styled(Box)({
  width: "573px",
  height: "689px",
  paddingTop: "89px",
  paddingRight: "83px",
  paddingBottom: "62px",
  paddingLeft: "83px",
  boxSizing: "border-box",
});

const BottomNote = styled(Typography)({
  /* Have an account? Sign In */
  position: "absolute",
  bottom: "46px",
  left: "50%",
  transform: "translateX(-50%)",
  fontFamily: "Noto Sans",
  fontStyle: "normal",
  fontWeight: 400,
  fontSize: 15,
  /* identical to box height, or 173% */
  textAlign: "center",

  color: "#2B2B2B",
  "& a": {
    /* Have an account? Sign In */

    fontFamily: "Noto Sans",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    /* identical to box height, or 173% */
    textAlign: "center",

    color: "#ED1C24",
  },
});

const SignUpPic = ({bottomNote}) => {
  return (
    <SectionWrapper>
      <Lstar component="img" src={lstar} alt="lstar" />
      <Cloud component="img" src={cloud} alt="cloud" />
      <BigStar component="img" src={bigStar} alt="bigStar" />
      <Star component="img" src={star} alt="star" />
      <Icon component="img" src={icon} alt="icon" />

      <ImageBox>
        <Box
          component="img"
          src={pinkMouse}
          alt="pink mouse"
          sx={{
            width: "100%",
              maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </ImageBox>

      <BottomNote>
        {bottomNote}
      </BottomNote>
    </SectionWrapper>
  );
};

export default SignUpPic;
