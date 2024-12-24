import { MDBFooter } from "mdb-react-ui-kit";
const FooterComponent = () => {
  return (
    <MDBFooter bgColor="light" className="text-center text-lg-start text-muted">
      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © 2024 Copyright: Học viện Công nghệ Bưu chính Viễn thông
        <h6>Design by: Fix Bug and Cry</h6>
      </div>
    </MDBFooter>
  );
};

export default FooterComponent;
