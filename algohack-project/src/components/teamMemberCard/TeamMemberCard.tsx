import React from "react";
import styles from './TeamMemberCard.module.scss';

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  skills: string[];
  imageUrl: string;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({
  name, 
  role,
  description,
  skills,
  imageUrl,
}) => {
  return (
    <div className={styles.team__member__card}>
      {/* left side with image*/}
      <div className={styles.team__member__card__image__container}>
        <img src={imageUrl} alt={name} className={styles.team__member__card__image} />
      </div>

      {/* right side with text */}
      <div className={styles.team__member__card__content}>
        <h2 className={styles.team__member__card__name}>{name}</h2>
        <h3 className={styles.team__member__card__role}>{role}</h3>
        <hr className={styles.team__member__card__divider} />
        <p className={styles.team__member__card__description}>{description}</p>
        <p className={styles.team__member__card__skills}>
          <strong>Навыки:</strong> {skills.join(", ")}
        </p>
        <button className={styles.team__member__card__button}>Связаться с нами</button>
      </div>
    </div>
  );
};

export default TeamMemberCard;