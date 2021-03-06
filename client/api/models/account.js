//----------------------------------------------------------------------------------------------------------------------
// AccountModel
//
// @module
//----------------------------------------------------------------------------------------------------------------------

import BaseModel from './base';

//----------------------------------------------------------------------------------------------------------------------

class AccountModel extends BaseModel
{
    //------------------------------------------------------------------------------------------------------------------
    // Properties
    //------------------------------------------------------------------------------------------------------------------

    get displayName(){ return this.$state.displayName || this.$state.email; }
    get avatarUrl()
    {
        const id = this.$state.id.replace(/-/g, '');
        return this.$state.avatar || `https://identicons.github.com/${ id }.png`;
    }
} // end AccountModel

//----------------------------------------------------------------------------------------------------------------------

export default AccountModel;

//----------------------------------------------------------------------------------------------------------------------