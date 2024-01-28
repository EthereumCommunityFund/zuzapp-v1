import React, { useState } from 'react';
import Avvvatars from 'avvvatars-react';
import { GuildedMember } from '@/hooks/useGuildedMembers';

type GuildedMembersProps = {
  member: GuildedMember;
};

function GuildedMembers({ member }: GuildedMembersProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="contributor">
      <div className="contrib_col">
        {!imgError ? (
          <div className="contrib_col_img_container">
            <img src={member.user.avatar || '/images/avatar_faux.png'} alt={member.user.name} onError={() => setImgError(true)} />
          </div>
        ) : (
          <img src="/images/avatar_faux.png" />
        )}
        <span className="contrib_name">{member.user.name}</span>
      </div>
      <div className="contrib_roles">
        {member.roles.map((role, roleIndex) => (
          <div key={roleIndex} className="contrib_role">
            <span>{role.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuildedMembers;
