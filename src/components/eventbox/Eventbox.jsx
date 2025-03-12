import styles from "./Eventbox.module.css";
const Eventbox = ({ eventImg, eventName, eventDate, eventView, eventPresent }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.eventImgDiv}>
          eventImgDiv
          {/* <img src={eventImg} alt="eventImg" className={styles.eventImg} /> */}
        </div>
        <div className={styles.eventTextDiv}>
          eventTextDiv
          <div>{eventName}</div>
          <div>
            <div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div></div>
              <div></div>
            </div>
            <div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Eventbox;
