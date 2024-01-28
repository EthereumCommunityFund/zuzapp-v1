import React, { useState } from 'react';
import Avvvatars from 'avvvatars-react';
import { GuildedMember } from '@/hooks/useGuildedMembers';

type GuildedMembersProps = {
  member: GuildedMember;
};

function GuildedMembers({ member }: GuildedMembersProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <div className="contrib_col">
        {!imgError ? <img src={member.user.avatar} alt={member.user.name} onError={() => setImgError(true)} /> : <Avvvatars value={member.user.name} style="shape" />}
        <span className="contrib_name">{member.user.name}</span>
      </div>
      <div className="contrib_roles">
        {member.roles.map((role, roleIndex) => (
          <div key={roleIndex} className="contrib_role">
            <span>{role.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default GuildedMembers;
