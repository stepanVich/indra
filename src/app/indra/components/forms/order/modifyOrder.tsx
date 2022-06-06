import WithLoading from 'app/indra/components/forms/loader';
import Order from 'app/indra/components/forms/order/order';
import {PanelProp} from 'app/indra/components/panels/panelController';
import React, {FunctionComponent} from 'react';

const OrderWithLoading = WithLoading(Order);

const ModifyOrder: FunctionComponent<PanelProp> = React.memo((props) => {
  return <OrderWithLoading modifyOrder {...props} />;
});

export default ModifyOrder;
