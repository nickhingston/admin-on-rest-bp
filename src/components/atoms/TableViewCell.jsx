import React from "react";
import PropTypes from "prop-types";
import styles from "style/TableViewCell.module.css";

const TableViewCell = (props) => {
	const {
		caption,
		title,
		body,
		children,
		dataId,
		icon,
		iconOnClick,
		onClick,
		border,
		bodySingleLine,
		titleSingleLine,
		selected,
		disabled
	} = props;

	let bodyStyle;
	let titleStyle;
	let firstColumnStyle;
	if (bodySingleLine) {
		bodyStyle = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
	}
	if (titleSingleLine) {
		titleStyle = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
	}
	if (icon) {
		firstColumnStyle = { overflow: "hidden" };
	}
	else {
		firstColumnStyle = { width: "100%" };
	}

	const classes = [
		styles.tableViewCell,
		(selected ? styles.selected : ""),
		(disabled ? styles.disable : null),
	];

	return (
		<div
			className={classes.join(" ")}
			role="presentation"
			style={{ borderWidth: `${border}px` }}
			onClick={disabled ? null : onClick}
			data-id={dataId}
		>
			{
				caption
              && <div className={styles.caption} style={{ textTransform: "uppercase" }}>{ caption }</div>
			}
			<div className={styles.columns}>
				<div className={styles.center} style={firstColumnStyle}>
					{
						title
						&& <div className={styles.headline} style={titleStyle}>{ title }</div>
					}
					{
						body
						&& <div style={bodyStyle}>{ body }</div>
					}
				</div>
				{
					icon
					&& (
						<div
							className={styles.center}
							role="presentation"
							style={{
								flex: 1,
								marginLeft: "10px",
								justifyContent: "flex-end",
								alignItems: "center",
								flexDirection: "row"
							}}
							onClick={iconOnClick}
						>
							{ icon }
						</div>
					)
				}
			</div>
			{
				children
				&& <div className="">{ children }</div>
			}
		</div>
	);
};

TableViewCell.defaultProps = {
	caption: null,
	title: null,
	body: null,
	icon: null,
	iconOnClick: null,
	onClick: null,
	dataId: null,
	border: 0.3,
	children: [],
	bodySingleLine: false,
	titleSingleLine: false,
	selected: false,
	disabled: false
};

TableViewCell.propTypes = {
	caption: PropTypes.node,
	title: PropTypes.node,
	body: PropTypes.node,
	dataId: PropTypes.string,
	children: PropTypes.node,
	icon: PropTypes.node,
	iconOnClick: PropTypes.func,
	border: PropTypes.number,
	onClick: PropTypes.func,
	bodySingleLine: PropTypes.bool,
	titleSingleLine: PropTypes.bool,
	selected: PropTypes.bool,
	disabled: PropTypes.bool
};

export default TableViewCell;
